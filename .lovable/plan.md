
## Goal
Make the Course Builder blocks “actually work” end-to-end without users needing to know HTML, fix Micro‑Quiz correctness across all quiz types, and make Whiteboard truly usable (draw + submit). Also run a systematic audit so you don’t have to test every block manually.

---

## What I found (root causes)
### 1) Text block authoring still expects HTML
`TextBlockEditor` currently uses a plain `<Textarea>` for `content.html` and shows “Supports basic HTML…”. That forces authors to write HTML.

### 2) Micro‑Quiz correctness bugs are caused by mismatched data/answer representations
Current quiz system mixes:
- **Index-based answers** for choice questions (`0..n-1`)
- **Array-of-indices** for multi-select
- **Short-answer** is configured in the editor, but the **student UI doesn’t render short-answer input**, and scoring doesn’t properly compare text answers.
Additionally, if we enable shuffling later (or it’s partially enabled), correct-answer indices can become misaligned unless we map “displayed option → original option index”.

### 3) Whiteboard is not interactive
Student runtime uses `WhiteboardBlockPreview` (a placeholder card + “Start Drawing” button) but there is no canvas or input, and it doesn’t call `submitWhiteboardWork`.

---

## Implementation plan (what I will build next)

### A) Replace Text block textarea with a real Rich Text Editor (no HTML required)
**Target files**
- `src/components/course-builder/BlockEditorDialog.tsx` (TextBlockEditor)
- Add a reusable editor component: `src/components/ui/rich-text-editor.tsx` (or `src/components/course-builder/RichTextEditor.tsx`)

**Approach**
1. Build a lightweight WYSIWYG editor using `contentEditable` + toolbar buttons:
   - Paragraph, Heading 2/3
   - Bold / Italic / Underline
   - Bullet list / Number list
   - Link insertion (URL prompt + validation)
   - Quote
   - Inline code / Code block
   - Simple table insert (2×2 and 3×3)
2. Store output as **HTML** (same as now), but authors never touch HTML.
3. Add a small “View HTML (advanced)” toggle for power users.
4. Add link safety in student rendering:
   - Ensure links open in new tab with `rel="noopener noreferrer"`
   - Basic validation warning in editor for malformed URLs.

**Acceptance criteria**
- Author can format text via toolbar; no HTML typing needed.
- Student preview renders formatted text correctly and safely.

---

### B) Fix Micro‑Quiz correctness for all types (single, multi, true/false, short-answer)
**Target files**
- `src/lib/demo-data.ts` (tighten MicroQuizQuestion typing)
- `src/lib/completion-rules.ts` (`checkQuizPassed`)
- `src/components/course-builder/StudentPreviewDialog.tsx` (`QuizBlockInteractive`)
- `src/components/course-builder/BlockEditorDialog.tsx` (`MicroQuizEditor`)
- Add tests: `src/test/*` (Vitest)

**Approach**
1. **Normalize the quiz question schema**
   - Update `MicroQuizQuestion` so short-answer has an explicit expected answer field (recommended) rather than abusing `options[0]`.
   - Expand `correctAnswer` to support short-answer cleanly (either `correctAnswerText: string` or allow `correctAnswer: string`).
2. **Update student runtime UI**
   - Add a short-answer input UI:
     - Text input
     - Submit button
     - Compare with case-sensitive toggle
3. **Make scoring robust**
   - In `checkQuizPassed`, branch by question type:
     - `single-choice` / `true-false`: compare selected index to correct index
     - `multi-select`: compare sorted arrays (without mutating original arrays)
     - `short-answer`: compare user string to expected string (case-sensitive optional; trim whitespace; optionally normalize multiple spaces)
4. **Fix correctness under shuffling**
   - If `shuffleAnswers` is enabled:
     - Render options using a derived array of `{ label, originalIndex }`
     - Store user answers as **original indices**, so scoring is stable regardless of shuffle order.
5. **Add unit tests so this can’t regress**
   - Tests for all four question types
   - Tests for `shuffleAnswers` mapping correctness
   - Tests for multi-select ordering invariance

**Acceptance criteria**
- Setting correct answer in the editor determines whether the student is marked correct.
- No more “defaults to D” behavior.
- Short-answer is answerable and scored correctly.
- Multi-select is scored correctly regardless of selection order.
- Tests pass.

---

### C) Make Whiteboard truly usable (draw + submit + progress)
**Target files**
- `src/components/course-builder/StudentPreviewDialog.tsx` (replace `WhiteboardBlockPreview` with interactive component)
- `src/contexts/CourseBuilderContext.tsx` (`submitWhiteboardWork` integration; progress state)
- Add new component: `src/components/course-builder/WhiteboardCanvas.tsx` (or similar)

**Approach (MVP that “works perfectly” for demo)**
1. Implement a Canvas-based whiteboard with pointer events:
   - Pen tool (color + size)
   - Eraser
   - Undo/redo
   - Clear canvas
2. Respect authoring settings:
   - Canvas size (a4/square/wide)
   - Background (blank/grid/ruled)
   - Enabled tools toggles (hide/disable buttons)
   - Multi-page (if enabled): pages navigation (Page 1/2/3…)
3. Submission flow:
   - Autosave draft locally in component state
   - “Submit” button calls `submitWhiteboardWork(blockId, data)` with:
     - `pngDataUrl` (for preview)
     - `strokesJson` (for future tutor annotation)
     - `meta` (tool settings used)
4. Mark completion based on submission (and reflect it in progress UI)

**Acceptance criteria**
- Student can actually draw on the whiteboard.
- Student can submit; submission is stored in `studentProgress`.
- Block shows completed state after submission.

---

### D) “Check everything” systematic audit (so you don’t test block-by-block)
**Target**
- Runtime stability, required-field handling, and no dead UI controls across all blocks.

**Approach**
1. Add a “Block QA checklist” pass inside code:
   - Ensure every block type has:
     - Authoring editor fields wired to `content`
     - Student runtime renderer/interaction (or explicitly labeled “coming soon”)
     - Completion logic hook (mark viewed / submit / passed)
2. Add a small internal “Block Diagnostics” helper (dev-only):
   - For each block on a page, show warnings if content is incomplete (e.g., image missing alt, resource missing URL, quiz missing questions/options)
3. Add unit tests for core non-UI logic:
   - completion rules for quiz/reorder/video threshold
   - visibility conditions (if currently used in runtime)

**Acceptance criteria**
- No block type renders a non-functional control without either working behavior or a clear “not implemented yet” message.
- Core logic covered by tests.

---

## Deliverables (what you’ll see after implementation)
- Text blocks edited with a proper WYSIWYG editor (toolbar).
- Micro‑Quiz correctness fixed for all supported quiz types; short-answer works.
- Whiteboard becomes a real drawable canvas with submit and completion tracking.
- A repeatable QA process + tests so regressions don’t keep appearing.

---

## Files that will change
- `src/components/course-builder/BlockEditorDialog.tsx`
- `src/components/course-builder/StudentPreviewDialog.tsx`
- `src/lib/completion-rules.ts`
- `src/lib/demo-data.ts`
- `src/contexts/CourseBuilderContext.tsx`
- New: `src/components/ui/rich-text-editor.tsx` (or course-builder equivalent)
- New: `src/components/course-builder/WhiteboardCanvas.tsx`
- Tests: `src/test/*`

---

## Manual test script (fast, end-to-end)
1. Add a Text block → use toolbar (bold, list, link) → save → preview as student → verify formatting and link behavior.
2. Add Micro‑Quiz:
   - single-choice with correct=B → student selects B → should be correct
   - multi-select with correct=[A,C] → student selects A+C → correct
   - true/false → correct respected
   - short-answer (case sensitive off) → “Quadratic Formula” vs “quadratic formula” → correct
3. Add Whiteboard → draw → submit → verify completion indicator updates.

