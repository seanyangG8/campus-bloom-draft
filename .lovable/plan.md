

# Plan: Fix Course Builder Functionality

## Summary

This plan addresses all the issues preventing the Course Builder from working correctly. The fixes span chapter/page isolation, block editor state synchronization, click-to-edit behavior, and several UI/state bugs.

---

## Issues Identified and Fixes

### Issue 1: Chapters Show Same Pages (Critical)

**Problem**: In `ChapterPageNav.tsx` line 318, the code iterates over the global `pages` array instead of the filtered `chapterPages`.

**Location**: `src/components/course-builder/ChapterPageNav.tsx` line 318

**Current Code**:
```tsx
{pages.map((page) => (
```

**Fix**: Change to iterate over chapter-filtered pages:
```tsx
{chapterPages.map((page) => (
```

---

### Issue 2: Wrong Page Count Display

**Problem**: Line 275 shows `pages.length` (global count) instead of pages for the current chapter.

**Location**: `src/components/course-builder/ChapterPageNav.tsx` line 275

**Current Code**:
```tsx
<span className="text-xs text-muted-foreground">{pages.length}</span>
```

**Fix**:
```tsx
<span className="text-xs text-muted-foreground">{chapterPages.length}</span>
```

---

### Issue 3: Click Block to Edit (Not Just 3-Dot Menu)

**Problem**: Users must click the dropdown menu to edit blocks. Clicking the block itself should open the editor.

**Location**: `src/components/course-builder/PageEditor.tsx` line 579-668

**Fix**: Add `onClick` handler to the block card area (excluding the drag handle and dropdown):
```tsx
<div 
  className="flex-1 min-w-0 cursor-pointer"
  onClick={() => isAdmin && onEdit()}
>
```

---

### Issue 4: Block Editor State Not Resetting When Switching Blocks

**Problem**: The `BlockEditorDialog` uses `useState` incorrectly as a side-effect. Lines 38-45 only run once on mount.

**Location**: `src/components/course-builder/BlockEditorDialog.tsx` lines 38-45

**Current Code**:
```tsx
useState(() => {
  if (block) {
    setTitle(block.title);
    setContent(block.content);
    setIsRequired(block.isRequired);
  }
});
```

**Fix**: Replace with proper `useEffect`:
```tsx
useEffect(() => {
  if (block) {
    setTitle(block.title);
    setContent(block.content || {});
    setIsRequired(block.isRequired);
  }
}, [block]);
```

Also add `useEffect` to the imports.

---

### Issue 5: Video/Image URL Shared Between Blocks

**Problem**: When editing a video block then an image block, they share state because `content` is passed by reference and not properly reset.

**Root Cause**: The `useEffect` fix above will address this. The content state persists across different block selections.

**Fix**: Ensure deep copy of content in `useEffect`:
```tsx
useEffect(() => {
  if (block) {
    setTitle(block.title);
    setContent(JSON.parse(JSON.stringify(block.content || {})));
    setIsRequired(block.isRequired);
  }
}, [block]);
```

---

### Issue 6: Micro-Quiz Options Not Displaying Correctly

**Problem**: Only 2 options are shown in the preview (line 751 uses `.slice(0, 2)`), and the demo data for quiz blocks has incorrect structure.

**Location**: `src/components/course-builder/PageEditor.tsx` lines 750-755

**Current Code**:
```tsx
{block.content.questions[0].options?.slice(0, 2).map((opt: string, i: number) => (
```

**Fix**: Show all 4 options in a grid layout:
```tsx
<div className="grid grid-cols-2 gap-2">
  {block.content.questions[0].options?.map((opt: string, i: number) => (
    <Button key={i} variant="outline" size="sm">
      {String.fromCharCode(65 + i)}) {opt || `Option ${i + 1}`}
    </Button>
  ))}
</div>
```

---

### Issue 7: Settings Button on CourseDetail Doesn't Work

**Problem**: The Settings button (line 60 in CourseDetail.tsx) has no click handler.

**Location**: `src/pages/app/CourseDetail.tsx` line 59-61

**Current Code**:
```tsx
<Button variant="outline" size="icon">
  <Settings className="h-4 w-4" />
</Button>
```

**Fix**: Create a `CourseSettingsDialog` and connect it:
```tsx
const [settingsOpen, setSettingsOpen] = useState(false);
...
<Button variant="outline" size="icon" onClick={() => setSettingsOpen(true)}>
  <Settings className="h-4 w-4" />
</Button>
```

---

### Issue 8: Preview Doesn't Show Changes After Editing

**Problem**: The `StudentPreviewDialog` reads blocks from context but may not reflect updates made in the editor.

**Root Cause**: The blocks are correctly fetched via `getBlocksByPage()` which reads from context state. However, the preview doesn't render actual block content - it shows placeholder text.

**Fix**: Update `StudentPreviewDialog` to render actual block content based on `block.content`:
- For text blocks: render the HTML content
- For quiz blocks: show actual questions and options
- For video/image: show the configured URL or placeholder

---

### Issue 9: Demo Data - Missing Pages for Chapters 2, 3, 4

**Problem**: Only Chapter 1 has pages defined. Chapters 2-4 have `pagesCount` set but no actual page records.

**Location**: `src/lib/demo-data.ts`

**Fix**: Add page definitions for chapters 2, 3, and 4 so each chapter has distinct content to work with.

---

### Issue 10: ReflectionBlockEditor Missing forwardRef

**Problem**: Console shows "Function components cannot be given refs" error for `ReflectionBlockEditor`.

**Location**: `src/components/course-builder/BlockEditorDialog.tsx`

**Fix**: This is likely caused by passing a functional component where a ref is expected. Wrap the component with `React.forwardRef` or ensure no ref is being passed to it incorrectly.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/course-builder/ChapterPageNav.tsx` | Lines 275, 318 - Fix page count and iteration |
| `src/components/course-builder/BlockEditorDialog.tsx` | Add useEffect import, fix state sync, add forwardRef if needed |
| `src/components/course-builder/PageEditor.tsx` | Add click-to-edit on blocks, fix quiz preview to show all options |
| `src/pages/app/CourseDetail.tsx` | Add CourseSettingsDialog for the settings button |
| `src/components/course-builder/StudentPreviewDialog.tsx` | Render actual block content instead of placeholders |
| `src/lib/demo-data.ts` | Add pages for chapters 2-4 with sample blocks |

---

## Implementation Order

1. **Fix ChapterPageNav.tsx** - Critical bugs preventing basic navigation
2. **Fix BlockEditorDialog.tsx** - State sync issues causing content sharing
3. **Fix PageEditor.tsx** - Click-to-edit and quiz display
4. **Add CourseSettingsDialog** - For the settings button
5. **Update StudentPreviewDialog** - Show real content
6. **Expand demo-data.ts** - Add content for all chapters

---

## Expected Results After Implementation

1. Each chapter displays only its own pages
2. Clicking a page in Chapter 1 does NOT affect Chapter 2
3. Clicking a block opens the editor (not just the 3-dot menu)
4. Editing one block then another correctly loads the new block's content
5. Video URL entered in video block stays only in that block
6. Micro-quiz shows all 4 options in the preview
7. Settings button opens course settings dialog
8. Preview shows actual block content that was configured
9. All chapters have pages to work with
10. No console errors about refs

