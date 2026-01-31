import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import {
  Plus,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Lock,
  CheckCircle2,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chapter, Page } from "@/lib/demo-data";
import { useCourseBuilder } from "@/contexts/CourseBuilderContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChapterPageNavProps {
  courseId: string;
  isAdmin: boolean;
}

export function ChapterPageNav({ courseId, isAdmin }: ChapterPageNavProps) {
  const { 
    getChaptersByCourse, 
    addChapter, 
    selectedPageId, 
    setSelectedPageId 
  } = useCourseBuilder();
  
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");

  const chapters = getChaptersByCourse(courseId);

  const handleAddChapter = () => {
    if (newChapterTitle.trim()) {
      addChapter(courseId, newChapterTitle.trim());
      setNewChapterTitle("");
      setIsAddingChapter(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 sm:p-4 border-b flex items-center justify-between gap-2 min-w-0">
        <h2 className="font-semibold text-sm sm:text-base truncate">Course Structure</h2>
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 shrink-0 px-2 sm:px-3"
            onClick={() => setIsAddingChapter(true)}
          >
            <Plus className="h-3 w-3" />
            <span className="hidden sm:inline">Chapter</span>
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {chapters.map((chapter) => (
          <ChapterItem
            key={chapter.id}
            chapter={chapter}
            selectedPageId={selectedPageId}
            onSelectPage={setSelectedPageId}
            isAdmin={isAdmin}
          />
        ))}

        {/* Add Chapter Input */}
        {isAddingChapter && (
          <motion.div
            className="p-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <div className="flex items-center gap-2">
              <Input
                placeholder="Chapter title..."
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddChapter();
                  if (e.key === "Escape") setIsAddingChapter(false);
                }}
                autoFocus
                className="h-8 text-sm"
              />
              <Button size="sm" className="h-8" onClick={handleAddChapter}>
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8"
                onClick={() => setIsAddingChapter(false)}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {chapters.length === 0 && !isAddingChapter && (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No chapters yet.
            {isAdmin && (
              <Button
                variant="link"
                size="sm"
                className="block mx-auto mt-2"
                onClick={() => setIsAddingChapter(true)}
              >
                Add your first chapter
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface ChapterItemProps {
  chapter: Chapter;
  selectedPageId: string | null;
  onSelectPage: (pageId: string | null) => void;
  isAdmin: boolean;
}

function ChapterItem({ chapter, selectedPageId, onSelectPage, isAdmin }: ChapterItemProps) {
  const { 
    getPagesByChapter, 
    addPage, 
    updateChapter, 
    deleteChapter,
    updatePage,
    deletePage,
    reorderPages,
    pages,
    blocks,
    getBlocksByPage
  } = useCourseBuilder();
  
  const [isOpen, setIsOpen] = useState(!chapter.isLocked);
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [editingChapter, setEditingChapter] = useState(false);
  const [editTitle, setEditTitle] = useState(chapter.title);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingPageTitle, setEditingPageTitle] = useState("");

  const chapterPages = getPagesByChapter(chapter.id);

  const handleAddPage = () => {
    if (newPageTitle.trim()) {
      addPage(chapter.id, newPageTitle.trim());
      setNewPageTitle("");
      setIsAddingPage(false);
    }
  };

  const handleUpdateChapter = () => {
    if (editTitle.trim()) {
      updateChapter(chapter.id, { title: editTitle.trim() });
      setEditingChapter(false);
    }
  };

  const handleDeleteChapter = () => {
    deleteChapter(chapter.id);
    setDeleteConfirmOpen(false);
  };

  const handleUpdatePageTitle = (pageId: string) => {
    if (editingPageTitle.trim()) {
      updatePage(pageId, { title: editingPageTitle.trim() });
    }
    setEditingPageId(null);
    setEditingPageTitle("");
  };

  const handleDeletePage = () => {
    if (pageToDelete) {
      deletePage(pageToDelete);
      setPageToDelete(null);
    }
  };

  // Duplicate page with all its blocks
  const handleDuplicatePage = (page: Page) => {
    const newPageId = addPage(chapter.id, `${page.title} (Copy)`);
    // In a real app, we'd also duplicate blocks here
    toast.success(`Page "${page.title}" duplicated`);
  };

  // Move page up/down
  const handleMovePage = (page: Page, direction: 'up' | 'down') => {
    const currentIndex = chapterPages.findIndex(p => p.id === page.id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= chapterPages.length) return;
    
    const newOrder = [...chapterPages];
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
    reorderPages(chapter.id, newOrder.map(p => p.id));
    toast.success(`Page moved ${direction}`);
  };

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="mb-1">
          <div
            className={cn(
              "flex items-center gap-1 p-2 rounded-lg hover:bg-muted/50 transition-colors group",
              chapter.isLocked && "opacity-60"
            )}
          >
            {isAdmin && (
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-1 flex-1 text-left min-w-0">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                <span className="text-sm font-medium truncate flex-1">{chapter.title}</span>
              </button>
            </CollapsibleTrigger>
            {chapter.isLocked ? (
              <Lock className="h-3 w-3 text-muted-foreground" />
            ) : (
              <span className="text-xs text-muted-foreground">{pages.length}</span>
            )}
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    setEditTitle(chapter.title);
                    setEditingChapter(true);
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsAddingPage(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Page
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateChapter(chapter.id, { isLocked: !chapter.isLocked })}>
                    <Lock className="mr-2 h-4 w-4" />
                    {chapter.isLocked ? "Unlock" : "Lock"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setDeleteConfirmOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <CollapsibleContent>
            <div className="ml-5 mt-1 space-y-0.5">
              {pages.map((page) => (
                <div key={page.id} className="group/page">
                  {editingPageId === page.id ? (
                    <div className="flex items-center gap-1 p-1">
                      <Input
                        value={editingPageTitle}
                        onChange={(e) => setEditingPageTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdatePageTitle(page.id);
                          if (e.key === "Escape") {
                            setEditingPageId(null);
                            setEditingPageTitle("");
                          }
                        }}
                        autoFocus
                        className="h-7 text-sm"
                      />
                      <Button size="sm" className="h-7 px-2" onClick={() => handleUpdatePageTitle(page.id)}>
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <button
                        onClick={() => onSelectPage(page.id)}
                        className={cn(
                          "flex-1 flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-colors",
                          selectedPageId === page.id
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                          page.isLocked && "opacity-50"
                        )}
                      >
                        {page.isCompleted ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                        ) : page.isLocked ? (
                          <Lock className="h-3.5 w-3.5 flex-shrink-0" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full border flex-shrink-0" />
                        )}
                        <span className="truncate flex-1">{page.title}</span>
                        {page.isRequired && (
                          <span className="text-xs text-accent">*</span>
                        )}
                      </button>
                      {isAdmin && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover/page:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setEditingPageId(page.id);
                              setEditingPageTitle(page.title);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicatePage(page)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleMovePage(page, 'up')}
                              disabled={chapterPages.findIndex(p => p.id === page.id) === 0}
                            >
                              <ChevronUp className="mr-2 h-4 w-4" />
                              Move Up
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleMovePage(page, 'down')}
                              disabled={chapterPages.findIndex(p => p.id === page.id) === chapterPages.length - 1}
                            >
                              <ChevronDown className="mr-2 h-4 w-4" />
                              Move Down
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updatePage(page.id, { isRequired: !page.isRequired })}>
                              {page.isRequired ? "Mark Optional" : "Mark Required"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updatePage(page.id, { isLocked: !page.isLocked })}>
                              <Lock className="mr-2 h-4 w-4" />
                              {page.isLocked ? "Unlock (Gate)" : "Lock (Gate)"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setPageToDelete(page.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isAdmin && (
                <>
                  {isAddingPage ? (
                    <div className="flex items-center gap-1 p-1">
                      <Input
                        placeholder="Page title..."
                        value={newPageTitle}
                        onChange={(e) => setNewPageTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddPage();
                          if (e.key === "Escape") {
                            setIsAddingPage(false);
                            setNewPageTitle("");
                          }
                        }}
                        autoFocus
                        className="h-7 text-sm"
                      />
                      <Button size="sm" className="h-7 px-2" onClick={handleAddPage}>
                        Add
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingPage(true)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Page
                    </button>
                  )}
                </>
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Edit Chapter Dialog */}
      <Dialog open={editingChapter} onOpenChange={setEditingChapter}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chapter</DialogTitle>
            <DialogDescription>Enter a new title for this chapter.</DialogDescription>
          </DialogHeader>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUpdateChapter();
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingChapter(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateChapter}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Chapter Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chapter?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{chapter.title}" and all its pages and content.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteChapter}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Page Confirmation */}
      <AlertDialog open={!!pageToDelete} onOpenChange={(open) => !open && setPageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this page and all its blocks.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeletePage}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
