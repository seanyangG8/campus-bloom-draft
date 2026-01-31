import { useState } from "react";
import { 
  Eye, 
  Lock, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  X,
  Play,
  AlertTriangle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useCourseBuilder } from "@/contexts/CourseBuilderContext";
import { Chapter, Page, Block, BlockType } from "@/lib/demo-data";
import { calculatePageCompletion, getBlockCompletionRule } from "@/lib/completion-rules";

interface StudentPreviewDialogProps {
  courseId: string;
  courseTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentPreviewDialog({ 
  courseId, 
  courseTitle, 
  open, 
  onOpenChange 
}: StudentPreviewDialogProps) {
  const { getChaptersByCourse, getPagesByChapter, getBlocksByPage } = useCourseBuilder();
  
  const chapters = getChaptersByCourse(courseId);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [completedPages, setCompletedPages] = useState<Set<string>>(new Set());
  
  // Flatten all pages with their chapter info
  const allPages: { page: Page; chapter: Chapter; blocks: Block[] }[] = [];
  chapters.forEach(chapter => {
    const pages = getPagesByChapter(chapter.id);
    pages.forEach(page => {
      const blocks = getBlocksByPage(page.id);
      allPages.push({ page, chapter, blocks });
    });
  });

  const currentPageData = allPages[currentPageIndex];
  const totalPages = allPages.length;
  
  // Check if current page is gated and previous page is not complete
  const isPageLocked = (index: number): boolean => {
    if (index === 0) return false;
    const prevPage = allPages[index - 1];
    if (prevPage.page.isLocked && !completedPages.has(prevPage.page.id)) {
      return true;
    }
    // Check all previous gated pages
    for (let i = 0; i < index; i++) {
      if (allPages[i].page.isLocked && !completedPages.has(allPages[i].page.id)) {
        return true;
      }
    }
    return false;
  };

  const handleMarkComplete = () => {
    if (currentPageData) {
      setCompletedPages(prev => new Set([...prev, currentPageData.page.id]));
    }
  };

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      const nextIndex = currentPageIndex + 1;
      if (!isPageLocked(nextIndex)) {
        setCurrentPageIndex(nextIndex);
      }
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const progressPercent = totalPages > 0 
    ? Math.round((completedPages.size / totalPages) * 100) 
    : 0;

  const getBlockTypeLabel = (type: BlockType): string => {
    const labels: Record<BlockType, string> = {
      'text': 'Text Content',
      'video': 'Video',
      'image': 'Image',
      'micro-quiz': 'Quiz',
      'drag-drop-reorder': 'Reorder Activity',
      'whiteboard': 'Whiteboard',
      'reflection': 'Reflection',
      'qa-thread': 'Q&A',
      'resource': 'Resource',
      'divider': 'Divider',
    };
    return labels[type] || type;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Eye className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base">Student Preview</DialogTitle>
              <DialogDescription className="text-xs">
                {courseTitle}
              </DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{progressPercent}% Complete</p>
              <p className="text-xs text-muted-foreground">
                {completedPages.size} of {totalPages} pages
              </p>
            </div>
            <Progress value={progressPercent} className="w-24 h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Page Navigation Sidebar */}
          <div className="w-56 border-r bg-muted/30 overflow-y-auto shrink-0">
            <div className="p-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Course Structure
              </p>
            </div>
            {chapters.map((chapter, chapterIndex) => {
              const pages = getPagesByChapter(chapter.id);
              return (
                <div key={chapter.id} className="mb-2">
                  <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    {chapter.title}
                  </div>
                  {pages.map((page) => {
                    const pageGlobalIndex = allPages.findIndex(p => p.page.id === page.id);
                    const isLocked = isPageLocked(pageGlobalIndex);
                    const isComplete = completedPages.has(page.id);
                    const isCurrent = currentPageIndex === pageGlobalIndex;
                    
                    return (
                      <button
                        key={page.id}
                        onClick={() => !isLocked && setCurrentPageIndex(pageGlobalIndex)}
                        disabled={isLocked}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors",
                          isCurrent && "bg-primary/10 text-primary",
                          !isCurrent && !isLocked && "hover:bg-muted",
                          isLocked && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                        ) : isLocked ? (
                          <Lock className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full border shrink-0" />
                        )}
                        <span className="truncate">{page.title}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Page Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {currentPageData ? (
              <>
                {/* Page Header */}
                <div className="p-4 border-b shrink-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <span>{currentPageData.chapter.title}</span>
                    <ChevronRight className="h-3 w-3" />
                    <span>Page {currentPageIndex + 1} of {totalPages}</span>
                  </div>
                  <h2 className="text-lg font-semibold">{currentPageData.page.title}</h2>
                  
                  {/* Gate warning */}
                  {currentPageData.page.isLocked && !completedPages.has(currentPageData.page.id) && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-warning bg-warning/10 px-2 py-1 rounded">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Complete this page to unlock the next one</span>
                    </div>
                  )}
                </div>

                {/* Blocks Preview */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4 max-w-2xl mx-auto">
                    {currentPageData.blocks.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>This page has no content yet.</p>
                      </div>
                    ) : (
                      currentPageData.blocks.map((block) => {
                        const rule = getBlockCompletionRule(block.type);
                        return (
                          <div 
                            key={block.id}
                            className="p-4 rounded-lg border bg-card"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">
                                {block.type === 'text' && '📝'}
                                {block.type === 'video' && '🎬'}
                                {block.type === 'image' && '🖼️'}
                                {block.type === 'micro-quiz' && '❓'}
                                {block.type === 'drag-drop-reorder' && '↕️'}
                                {block.type === 'whiteboard' && '✏️'}
                                {block.type === 'reflection' && '💭'}
                                {block.type === 'qa-thread' && '💬'}
                                {block.type === 'resource' && '📎'}
                                {block.type === 'divider' && '—'}
                              </span>
                              <span className="font-medium text-sm">{block.title}</span>
                              {block.isRequired && (
                                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {getBlockTypeLabel(block.type)} • {rule.description}
                            </p>
                            {/* Placeholder content */}
                            <div className="mt-3 p-4 bg-muted/50 rounded border-2 border-dashed text-center text-sm text-muted-foreground">
                              {block.type === 'video' && (
                                <div className="flex items-center justify-center gap-2">
                                  <Play className="h-5 w-5" />
                                  <span>Video player would appear here</span>
                                </div>
                              )}
                              {block.type === 'micro-quiz' && 'Quiz questions would appear here'}
                              {block.type === 'whiteboard' && 'Whiteboard canvas would appear here'}
                              {block.type === 'reflection' && 'Text input for reflection would appear here'}
                              {block.type === 'text' && 'Rich text content would appear here'}
                              {block.type === 'image' && 'Image would appear here'}
                              {block.type === 'drag-drop-reorder' && 'Drag and drop interface would appear here'}
                              {block.type === 'resource' && 'Download link would appear here'}
                              {block.type === 'qa-thread' && 'Q&A thread would appear here'}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>

                {/* Footer Navigation */}
                <div className="p-4 border-t shrink-0 flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentPageIndex === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {!completedPages.has(currentPageData.page.id) ? (
                      <Button onClick={handleMarkComplete}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-success">
                        <CheckCircle2 className="h-4 w-4" />
                        Completed
                      </span>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={currentPageIndex === totalPages - 1 || isPageLocked(currentPageIndex + 1)}
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>No pages available in this course.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
