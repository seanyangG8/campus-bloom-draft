
# Plan: Enhanced Block-by-Block Features for Course Builder

## Summary

This plan implements comprehensive authoring and student runtime features for all 10 block types in the Course Builder. Each block will have enhanced configuration options, proper student interaction, progress tracking, and completion logic integration.

---

## Current State Analysis

The existing implementation has:
- Basic block editors with minimal configuration options
- Simple preview rendering in the PageEditor
- Basic student preview dialog showing content
- Completion rules defined but not fully interactive
- No advanced settings like attempts, scoring, visibility rules

---

## Block Enhancement Overview

### Content Blocks

| Block | Current | Enhanced |
|-------|---------|----------|
| Text | Plain textarea | Rich callout styles, math support placeholder, completion tracking |
| Video | URL + duration only | Captions, transcript, watch threshold, chapter markers, resume playback |
| Image | URL + alt + caption | Size constraints, gallery mode, zoom preview, download toggle |
| Resource | URL + filename | File type badges, must-open toggle, version label, expiry date |
| Divider | Line only | Style options (line/whitespace/section), section heading, spacing |

### Active Learning Blocks

| Block | Current | Enhanced |
|-------|---------|----------|
| Micro-Quiz | MCQ only | Multi-select, true/false, short answer, hints, explanations, max attempts, shuffle, pass mark |
| Reorder | Basic items list | Instruction field, partial credit toggle, show correct order after, max attempts |
| Whiteboard | Basic prompt | Canvas size, background style, tool toggles, rubric field, max attempts |
| Reflection | Prompt + minWords | Max words, privacy mode (private/peer gallery/anonymous), peer comments toggle |
| Q&A Thread | Minimal | Posting permissions, anonymity settings, moderation tools, attachments toggle |

---

## Implementation Phases

### Phase 1: Enhanced Block Data Model

**File:** `src/lib/demo-data.ts`

Extend the `Block` interface with new common and type-specific fields:

```text
Block (common fields):
- points: number (optional)
- availabilityStart: string (optional datetime)
- availabilityEnd: string (optional datetime)
- visibilityCondition: 'always' | 'after_prev_complete' | 'score_threshold'
- visibilityThreshold: number (for score-based visibility)
- maxAttempts: number (optional, default unlimited)
- completionStatus: 'not_started' | 'in_progress' | 'completed'
```

---

### Phase 2: Enhanced Block Editors

**File:** `src/components/course-builder/BlockEditorDialog.tsx`

Restructure into a tabbed interface for complex blocks:
- **Content Tab**: Block-specific content configuration
- **Settings Tab**: Common settings (required, points, visibility, attempts)

#### 2.1 TextBlockEditor Enhancements

```text
New fields:
- calloutStyle: 'none' | 'info' | 'warning' | 'tip' | 'success'
- enableMathSupport: boolean (placeholder for future LaTeX)
- showCompletionTracking: boolean

UI Changes:
- Callout style dropdown with visual preview
- Math toggle (shows "Coming soon" tooltip)
- Rich text toolbar placeholder
```

#### 2.2 VideoBlockEditor Enhancements

```text
New fields:
- captionsUrl: string (VTT/SRT upload URL)
- transcript: string (text field)
- startTime: string (e.g., "0:30")
- endTime: string
- watchThreshold: number (percentage 0-100, default 80)
- allowDownload: boolean
- chapters: Array<{time: string, title: string}>

UI Changes:
- Collapsible sections for basic/advanced settings
- Chapter markers list with add/remove
- Watch threshold slider
```

#### 2.3 ImageBlockEditor Enhancements

```text
New fields:
- displaySize: 'small' | 'medium' | 'large' | 'full'
- allowDownload: boolean
- galleryMode: boolean (for multiple images)
- images: Array<{url, alt, caption}> (when gallery mode)

UI Changes:
- Size selector with visual indicators
- Download toggle
- Gallery mode switch (shows multi-image UI when enabled)
```

#### 2.4 ResourceBlockEditor Enhancements

```text
New fields:
- resourceType: 'file' | 'link'
- fileType: 'pdf' | 'doc' | 'ppt' | 'xls' | 'image' | 'zip' | 'other'
- mustOpenToComplete: boolean
- versionLabel: string
- expiryDate: string
- openInNewTab: boolean

UI Changes:
- File type selector with icons
- Must-open completion toggle
- Version and expiry fields
```

#### 2.5 DividerBlockEditor (New)

```text
Fields:
- style: 'line' | 'whitespace' | 'section-break'
- sectionHeading: string (optional)
- anchorId: string (for deep links)
- spacing: 'compact' | 'normal' | 'large'

UI Changes:
- Style selector with visual preview
- Section heading input (appears when style is 'section-break')
- Spacing control
```

#### 2.6 MicroQuizEditor Enhancements

```text
New question types:
- type: 'single-choice' | 'multi-select' | 'true-false' | 'short-answer'

Per-question fields:
- hint: string
- explanation: string
- points: number
- caseSensitive: boolean (for short-answer)

Quiz settings:
- maxAttempts: number
- shuffleQuestions: boolean
- shuffleAnswers: boolean
- showCorrectAfterAttempt: boolean
- allowRetryImmediately: boolean
- passMark: number (percentage)
- completionRule: 'attempted' | 'passed'

UI Changes:
- Question type selector
- Hint and explanation fields per question
- Settings panel with all quiz options
- Points input per question
```

#### 2.7 ReorderBlockEditor Enhancements

```text
New fields:
- scoringMode: 'all-or-nothing' | 'partial-credit'
- showCorrectOrderAfter: boolean
- explanation: string
- maxAttempts: number
- completionRule: 'attempted' | 'passed'
- distractorItems: string[] (optional wrong items)

UI Changes:
- Scoring mode toggle with explanation
- Explanation field
- Distractor items section (optional)
```

#### 2.8 WhiteboardBlockEditor Enhancements

```text
New fields:
- canvasSize: 'a4' | 'square' | 'wide'
- background: 'blank' | 'grid' | 'ruled'
- enabledTools: {pen, highlighter, eraser, shapes, text, undo}
- multiPage: boolean
- maxAttempts: number
- rubric: string
- dueDate: string

UI Changes:
- Canvas size and background selectors
- Tool toggle checkboxes
- Rubric text area
- Due date picker
```

#### 2.9 ReflectionBlockEditor Enhancements

```text
New fields:
- maxWords: number
- rubric: string
- points: number
- privacyMode: 'private' | 'peer-gallery' | 'anonymous'
- allowPeerComments: boolean
- mustSubmitToComplete: boolean
- exampleResponse: string

UI Changes:
- Min/max word inputs
- Privacy mode selector with descriptions
- Peer comments toggle (when peer-gallery mode)
- Example response field
```

#### 2.10 QAThreadBlockEditor (New)

```text
Fields:
- whoCanPost: 'students-only' | 'students-and-tutors'
- anonymity: 'off' | 'optional' | 'always-anonymous'
- allowAttachments: boolean
- categories: string[] (e.g., Homework, Concepts, Admin)
- moderationEnabled: boolean

UI Changes:
- Posting permissions selector
- Anonymity mode selector
- Attachments toggle
- Categories list editor
```

---

### Phase 3: Common Block Settings Panel

**New Component:** `src/components/course-builder/BlockSettingsPanel.tsx`

A reusable panel for common block settings that appears in all block editors:

```text
Sections:
1. Completion Settings
   - Required toggle
   - Points input
   - Completion tracking method display

2. Availability (collapsible)
   - Start date/time picker
   - End date/time picker

3. Visibility Rules (collapsible)
   - Condition selector: Always visible, After previous complete, Score threshold
   - Threshold input (when score-based)
   - Student group/cohort selector (future)

4. Attempts (for interactive blocks)
   - Max attempts: unlimited or number
```

---

### Phase 4: Enhanced Block Preview Components

**File:** `src/components/course-builder/PageEditor.tsx`

Update `BlockPreview` to show enhanced configuration:

```text
Improvements:
- Show callout styling for text blocks
- Show watch threshold badge for videos
- Show file type icon for resources
- Show question count and types for quizzes
- Show scoring mode for reorder blocks
- Show canvas size preview for whiteboard
- Show privacy mode badge for reflections
```

---

### Phase 5: Interactive Student Preview

**File:** `src/components/course-builder/StudentPreviewDialog.tsx`

Upgrade to support actual block interactions:

```text
Student Block Components:
- StudentTextBlock: Rendered HTML with callout styling
- StudentVideoBlock: Playable embed or placeholder with controls
- StudentQuizBlock: Interactive MCQ with answer selection and feedback
- StudentReorderBlock: Drag-and-drop with submit and feedback
- StudentWhiteboardBlock: Canvas placeholder with tool indicators
- StudentReflectionBlock: Text input with word count
- StudentResourceBlock: Download button with tracking indicator
```

Each block shows:
- Completion indicator (circle icon that fills when complete)
- Required badge
- Points badge (if applicable)
- Interactive elements based on block type

---

### Phase 6: Student Runtime State Management

**File:** `src/contexts/CourseBuilderContext.tsx`

Add student progress tracking:

```text
New state:
- studentProgress: Map<blockId, BlockProgress>

BlockProgress interface:
- status: 'not_started' | 'in_progress' | 'completed'
- attempts: number
- score: number (for scored blocks)
- lastAttemptAt: string
- completedAt: string
- responses: any (block-specific data)
```

New functions:
- markBlockViewed(blockId)
- submitQuizAnswer(blockId, answers)
- submitReorderAttempt(blockId, order)
- submitWhiteboardWork(blockId, data)
- submitReflection(blockId, text)

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/lib/demo-data.ts` | Modify | Extend Block interface with new fields |
| `src/components/course-builder/BlockEditorDialog.tsx` | Major rewrite | Tabbed interface with all enhanced editors |
| `src/components/course-builder/BlockSettingsPanel.tsx` | Create | Reusable common settings component |
| `src/components/course-builder/PageEditor.tsx` | Modify | Enhanced BlockPreview with new field display |
| `src/components/course-builder/StudentPreviewDialog.tsx` | Major update | Interactive student experience |
| `src/contexts/CourseBuilderContext.tsx` | Modify | Add student progress tracking functions |
| `src/lib/completion-rules.ts` | Modify | Add pass/fail completion logic for scored blocks |

---

## Technical Considerations

### State Management
- Block content objects will grow significantly
- Use deep cloning when editing to prevent state leakage
- Consider lazy loading for complex block editors

### Performance
- Large quiz blocks may have many questions
- Use virtualization if needed for long lists
- Debounce auto-save for student responses

### Validation
- Add form validation for required fields
- Show warnings for incomplete configuration
- Validate URL formats for video/image/resource blocks

---

## Priority Order

1. **MicroQuizEditor** - Most complex, highest value for learning
2. **BlockSettingsPanel** - Enables common features across all blocks
3. **VideoBlockEditor** - High usage, watch threshold is key feature
4. **ReorderBlockEditor** - Interactive learning, needs scoring options
5. **WhiteboardBlockEditor** - Canvas configuration is important
6. **ReflectionBlockEditor** - Privacy modes are differentiating
7. **ResourceBlockEditor** - Must-open completion is useful
8. **TextBlockEditor** - Callout styles enhance content
9. **ImageBlockEditor** - Size/gallery options
10. **QAThreadBlockEditor** - Moderation settings
11. **DividerBlockEditor** - Section break styling
12. **StudentPreviewDialog** - Make all blocks interactive

---

## Estimated Complexity

- **BlockEditorDialog rewrite**: ~800 lines (from ~500)
- **BlockSettingsPanel**: ~200 lines
- **StudentPreviewDialog interactive**: ~600 lines (from ~400)
- **Context updates**: ~100 lines
- **Demo data updates**: ~50 lines

Total: ~1750 lines of new/modified code

---

## Testing Recommendations

After implementation:
1. Create a new micro-quiz with multi-select questions and test all options
2. Configure a video with watch threshold and verify it shows in preview
3. Set up a reorder block with partial credit scoring
4. Test visibility rules by setting "after previous complete"
5. Verify student preview shows interactive elements correctly
6. Check that completion logic respects pass marks for quizzes
