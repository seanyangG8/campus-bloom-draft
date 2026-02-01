import { useState, useEffect } from "react";
import { 
  Eye, 
  Lock, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Play,
  AlertTriangle,
  GripVertical,
  Download,
  ExternalLink,
  Lightbulb
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCourseBuilder } from "@/contexts/CourseBuilderContext";
import { Chapter, Page, Block, BlockType } from "@/lib/demo-data";
import { calculatePageCompletion, getBlockCompletionRule, BlockProgress } from "@/lib/completion-rules";
import { toast } from "sonner";
import { WhiteboardCanvas } from "./WhiteboardCanvas";

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
  const { 
    getChaptersByCourse, 
    getPagesByChapter, 
    getBlocksByPage,
    studentProgress,
    markBlockViewed,
    submitQuizAnswer,
    submitReorderAttempt,
    submitReflection,
    submitWhiteboardWork,
    getBlockProgress,
  } = useCourseBuilder();
  
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0">
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
            {chapters.map((chapter) => {
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
                      currentPageData.blocks.map((block) => (
                        <InteractiveBlock 
                          key={block.id} 
                          block={block}
                          progress={getBlockProgress(block.id)}
                          onMarkViewed={() => markBlockViewed(block.id)}
                          onSubmitQuiz={(answers) => submitQuizAnswer(block.id, answers)}
                          onSubmitReorder={(order) => submitReorderAttempt(block.id, order)}
                          onSubmitReflection={(text) => submitReflection(block.id, text)}
                          onSubmitWhiteboard={(data) => submitWhiteboardWork(block.id, data)}
                        />
                      ))
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

// Interactive Block Component
interface InteractiveBlockProps {
  block: Block;
  progress?: BlockProgress;
  onMarkViewed: () => void;
  onSubmitQuiz: (answers: Record<string, number | number[] | string>) => { passed: boolean; score: number };
  onSubmitReorder: (order: number[]) => { correct: boolean; score: number };
  onSubmitReflection: (text: string) => void;
  onSubmitWhiteboard: (data: any) => void;
}

function InteractiveBlock({ 
  block, 
  progress, 
  onMarkViewed,
  onSubmitQuiz,
  onSubmitReorder,
  onSubmitReflection,
  onSubmitWhiteboard,
}: InteractiveBlockProps) {
  const rule = getBlockCompletionRule(block.type);
  const isComplete = progress?.status === 'completed';

  // Mark viewable blocks as viewed when rendered
  useEffect(() => {
    if (['text', 'image', 'resource'].includes(block.type) && !isComplete) {
      const timer = setTimeout(() => onMarkViewed(), 1000);
      return () => clearTimeout(timer);
    }
  }, [block.type, isComplete, onMarkViewed]);

  return (
    <div 
      className={cn(
        "p-4 rounded-lg border bg-card transition-all",
        isComplete && "ring-2 ring-success/30"
      )}
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
        {isComplete && (
          <CheckCircle2 className="h-4 w-4 text-success ml-auto" />
        )}
      </div>

      {/* Block content based on type */}
      <div className="mt-3">
        {block.type === 'text' && <TextBlockPreview block={block} />}
        {block.type === 'video' && <VideoBlockPreview block={block} />}
        {block.type === 'image' && <ImageBlockPreview block={block} />}
        {block.type === 'micro-quiz' && (
          <QuizBlockInteractive 
            block={block} 
            progress={progress}
            onSubmit={onSubmitQuiz} 
          />
        )}
        {block.type === 'drag-drop-reorder' && (
          <ReorderBlockInteractive 
            block={block} 
            progress={progress}
            onSubmit={onSubmitReorder} 
          />
        )}
        {block.type === 'whiteboard' && (
          <WhiteboardBlockInteractive 
            block={block} 
            progress={progress}
            onSubmit={onSubmitWhiteboard} 
          />
        )}
        {block.type === 'reflection' && (
          <ReflectionBlockInteractive 
            block={block} 
            progress={progress}
            onSubmit={onSubmitReflection} 
          />
        )}
        {block.type === 'resource' && <ResourceBlockPreview block={block} />}
        {block.type === 'qa-thread' && <QAThreadBlockPreview block={block} />}
        {block.type === 'divider' && <DividerBlockPreview block={block} />}
      </div>
    </div>
  );
}

// Text Block Preview with safe link rendering
function TextBlockPreview({ block }: { block: Block }) {
  const calloutStyle = block.content?.calloutStyle;
  
  // Sanitize HTML to ensure links open safely
  const sanitizeHtml = (html: string) => {
    // Add target="_blank" and rel="noopener noreferrer" to all anchor tags
    return html.replace(/<a\s+([^>]*href=[^>]*)>/gi, (match, attrs) => {
      if (!attrs.includes('target=')) {
        attrs += ' target="_blank"';
      }
      if (!attrs.includes('rel=')) {
        attrs += ' rel="noopener noreferrer"';
      }
      return `<a ${attrs}>`;
    });
  };
  
  return (
    <div className={cn(
      "p-4 bg-muted/50 rounded prose prose-sm max-w-none",
      "prose-a:text-primary prose-a:underline",
      calloutStyle === 'info' && "bg-blue-50 border-l-4 border-blue-500 dark:bg-blue-950/30",
      calloutStyle === 'warning' && "bg-amber-50 border-l-4 border-amber-500 dark:bg-amber-950/30",
      calloutStyle === 'tip' && "bg-green-50 border-l-4 border-green-500 dark:bg-green-950/30",
      calloutStyle === 'success' && "bg-emerald-50 border-l-4 border-emerald-500 dark:bg-emerald-950/30",
    )}>
      {block.content?.html ? (
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.content.html) }} />
      ) : (
        <p className="text-muted-foreground italic">No content yet</p>
      )}
    </div>
  );
}

// Video Block Preview
function VideoBlockPreview({ block }: { block: Block }) {
  return (
    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
      {block.content?.url ? (
        <>
          <div className="text-center">
            <Play className="h-16 w-16 text-muted-foreground/50 mx-auto mb-2 hover:text-primary cursor-pointer transition-colors" />
            <p className="text-sm text-muted-foreground">{block.content.duration || "Video"}</p>
            {block.content.watchThreshold && (
              <p className="text-xs text-muted-foreground mt-1">
                Watch {block.content.watchThreshold}% to complete
              </p>
            )}
          </div>
          {block.content.transcript && (
            <Button variant="ghost" size="sm" className="absolute bottom-2 right-2">
              View Transcript
            </Button>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">No video URL set</p>
      )}
    </div>
  );
}

// Image Block Preview
function ImageBlockPreview({ block }: { block: Block }) {
  const [isZoomed, setIsZoomed] = useState(false);
  
  return (
    <div className={cn(
      "bg-muted rounded-lg flex items-center justify-center overflow-hidden cursor-pointer",
      block.content?.displaySize === 'small' && "max-w-[25%]",
      block.content?.displaySize === 'medium' && "max-w-[50%]",
      block.content?.displaySize === 'large' && "max-w-[75%]",
    )}
    onClick={() => setIsZoomed(!isZoomed)}
    >
      {block.content?.url ? (
        <div className="relative">
          <img
            src={block.content.url}
            alt={block.content.alt || ""}
            className="w-full h-auto"
          />
          {block.content.caption && (
            <p className="text-xs text-center text-muted-foreground mt-2 italic">
              {block.content.caption}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground p-8">No image URL set</p>
      )}
    </div>
  );
}

// Interactive Quiz Block
function QuizBlockInteractive({ 
  block, 
  progress,
  onSubmit 
}: { 
  block: Block; 
  progress?: BlockProgress;
  onSubmit: (answers: Record<string, number | number[] | string>) => { passed: boolean; score: number };
}) {
  const questions = block.content?.questions || [];
  const [answers, setAnswers] = useState<Record<string, number | number[] | string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ passed: boolean; score: number } | null>(null);
  const [showHints, setShowHints] = useState<Set<string>>(new Set());

  const handleAnswerChange = (questionId: string, value: number | number[] | string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const res = onSubmit(answers);
    setResult(res);
    setSubmitted(true);
    if (res.passed) {
      toast.success(`Quiz passed! Score: ${res.score}%`);
    } else {
      toast.error(`Quiz not passed. Score: ${res.score}%`);
    }
  };

  const toggleHint = (questionId: string) => {
    setShowHints(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  if (questions.length === 0) {
    return <p className="text-sm text-muted-foreground">No questions configured</p>;
  }

  return (
    <div className="space-y-4">
      {questions.map((q: any, qIndex: number) => {
        const userAnswer = answers[q.id];
        const isAnswered = userAnswer !== undefined && userAnswer !== '';
        
        // Calculate correctness based on question type
        const getIsCorrect = () => {
          if (!submitted) return false;
          if (q.type === 'multi-select') {
            const userArr = Array.isArray(userAnswer) ? [...userAnswer].sort((a, b) => a - b) : [];
            const correctArr = Array.isArray(q.correctAnswer) ? [...q.correctAnswer].sort((a, b) => a - b) : [];
            return JSON.stringify(userArr) === JSON.stringify(correctArr);
          } else if (q.type === 'short-answer') {
            const userText = typeof userAnswer === 'string' ? userAnswer.trim() : '';
            const expectedText = (q.correctAnswerText || q.options?.[0] || '').trim();
            if (q.caseSensitive) {
              return userText === expectedText;
            }
            return userText.toLowerCase() === expectedText.toLowerCase();
          } else {
            // single-choice or true-false
            return userAnswer === q.correctAnswer;
          }
        };
        const isCorrect = getIsCorrect();

        return (
          <div key={q.id || qIndex} className="p-4 bg-muted/50 rounded-lg">
            <p className="font-medium text-sm mb-3">
              Q{qIndex + 1}: {q.question || "Question not set"}
            </p>

            {/* Question type specific rendering */}
            {(q.type === 'single-choice' || !q.type) && (
              <div className="space-y-2">
                {q.options?.map((opt: string, i: number) => (
                  <button 
                    key={i}
                    onClick={() => !submitted && handleAnswerChange(q.id, i)}
                    disabled={submitted}
                    className={cn(
                      "w-full p-3 text-left text-sm border rounded-lg transition-all",
                      userAnswer === i && !submitted && "border-primary bg-primary/10",
                      submitted && q.correctAnswer === i && "border-success bg-success/10",
                      submitted && userAnswer === i && q.correctAnswer !== i && "border-destructive bg-destructive/10",
                      !submitted && userAnswer !== i && "hover:bg-muted"
                    )}
                  >
                    {String.fromCharCode(65 + i)}) {opt || `Option ${i + 1}`}
                    {submitted && q.correctAnswer === i && <CheckCircle2 className="inline h-4 w-4 ml-2 text-success" />}
                  </button>
                ))}
              </div>
            )}

            {q.type === 'multi-select' && (
              <div className="space-y-2">
                {q.options?.map((opt: string, i: number) => {
                  const selected = Array.isArray(userAnswer) && userAnswer.includes(i);
                  const isCorrectOption = Array.isArray(q.correctAnswer) && q.correctAnswer.includes(i);
                  
                  return (
                    <button 
                      key={i}
                      onClick={() => {
                        if (submitted) return;
                        const current = (userAnswer as number[]) || [];
                        const newAnswer = selected 
                          ? current.filter(x => x !== i)
                          : [...current, i];
                        handleAnswerChange(q.id, newAnswer);
                      }}
                      disabled={submitted}
                      className={cn(
                        "w-full p-3 text-left text-sm border rounded-lg transition-all flex items-center gap-2",
                        selected && !submitted && "border-primary bg-primary/10",
                        submitted && isCorrectOption && "border-success bg-success/10",
                        submitted && selected && !isCorrectOption && "border-destructive bg-destructive/10",
                        !submitted && !selected && "hover:bg-muted"
                      )}
                    >
                      <input 
                        type="checkbox" 
                        checked={selected} 
                        readOnly 
                        className="h-4 w-4"
                      />
                      {String.fromCharCode(65 + i)}) {opt || `Option ${i + 1}`}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === 'true-false' && (
              <div className="flex gap-4">
                {['True', 'False'].map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => !submitted && handleAnswerChange(q.id, i)}
                    disabled={submitted}
                    className={cn(
                      "flex-1 p-3 text-center text-sm border rounded-lg transition-all",
                      userAnswer === i && !submitted && "border-primary bg-primary/10",
                      submitted && q.correctAnswer === i && "border-success bg-success/10",
                      submitted && userAnswer === i && q.correctAnswer !== i && "border-destructive bg-destructive/10",
                      !submitted && userAnswer !== i && "hover:bg-muted"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Short Answer Input */}
            {q.type === 'short-answer' && (
              <div className="space-y-2">
                <Input
                  type="text"
                  value={(userAnswer as string) || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder="Type your answer..."
                  disabled={submitted}
                  className={cn(
                    submitted && isCorrect && "border-success bg-success/10",
                    submitted && !isCorrect && "border-destructive bg-destructive/10"
                  )}
                />
                {submitted && (
                  <div className={cn(
                    "text-xs p-2 rounded",
                    isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  )}>
                    {isCorrect ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Correct!
                      </span>
                    ) : (
                      <span>
                        Expected: <strong>{q.correctAnswerText || q.options?.[0]}</strong>
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
            {q.hint && !submitted && (
              <button 
                onClick={() => toggleHint(q.id)}
                className="mt-2 text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                <Lightbulb className="h-3 w-3" />
                {showHints.has(q.id) ? 'Hide hint' : 'Show hint'}
              </button>
            )}
            {showHints.has(q.id) && q.hint && (
              <p className="mt-2 text-xs bg-muted p-2 rounded">{q.hint}</p>
            )}

            {/* Explanation after submission */}
            {submitted && q.explanation && (
              <div className="mt-3 p-2 bg-muted rounded text-xs">
                <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <Button 
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
          className="w-full"
        >
          Submit Answers
        </Button>
      ) : (
        <div className={cn(
          "p-3 rounded-lg text-center",
          result?.passed ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        )}>
          <p className="font-medium">
            {result?.passed ? "Passed!" : "Not passed"} - Score: {result?.score}%
          </p>
        </div>
      )}
    </div>
  );
}

// Interactive Reorder Block
function ReorderBlockInteractive({ 
  block, 
  progress,
  onSubmit 
}: { 
  block: Block; 
  progress?: BlockProgress;
  onSubmit: (order: number[]) => { correct: boolean; score: number };
}) {
  const items = block.content?.items || [];
  const [userOrder, setUserOrder] = useState<number[]>(() => {
    // Shuffle items initially
    const indices = items.map((_: any, i: number) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; score: number } | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newOrder = [...userOrder];
    const draggedItem = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    setUserOrder(newOrder);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = () => {
    const res = onSubmit(userOrder);
    setResult(res);
    setSubmitted(true);
    if (res.correct) {
      toast.success("Correct order!");
    } else {
      toast.error(`Score: ${res.score}%`);
    }
  };

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No items configured</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {block.content?.instruction || "Drag and drop to reorder:"}
      </p>
      
      <div className="space-y-2">
        {userOrder.map((itemIndex, displayIndex) => (
          <div
            key={itemIndex}
            draggable={!submitted}
            onDragStart={() => handleDragStart(displayIndex)}
            onDragOver={(e) => handleDragOver(e, displayIndex)}
            onDragEnd={handleDragEnd}
            className={cn(
              "flex items-center gap-2 p-3 bg-muted/50 rounded border transition-all",
              !submitted && "cursor-move hover:bg-muted",
              draggedIndex === displayIndex && "opacity-50",
              submitted && block.content?.correctOrder?.[displayIndex] === itemIndex && "border-success bg-success/10",
              submitted && block.content?.correctOrder?.[displayIndex] !== itemIndex && "border-destructive bg-destructive/10"
            )}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{items[itemIndex] || `Item ${itemIndex + 1}`}</span>
          </div>
        ))}
      </div>

      {!submitted ? (
        <Button onClick={handleSubmit} className="w-full">
          Check Order
        </Button>
      ) : (
        <>
          <div className={cn(
            "p-3 rounded-lg text-center",
            result?.correct ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          )}>
            <p className="font-medium">
              {result?.correct ? "Correct!" : `Score: ${result?.score}%`}
            </p>
          </div>
          
          {block.content?.showCorrectOrderAfter !== false && !result?.correct && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs font-medium mb-2">Correct order:</p>
              {(block.content?.correctOrder || []).map((idx: number, i: number) => (
                <p key={i} className="text-xs">{i + 1}. {items[idx]}</p>
              ))}
            </div>
          )}
          
          {block.content?.explanation && (
            <p className="text-xs text-muted-foreground">{block.content.explanation}</p>
          )}
        </>
      )}
    </div>
  );
}

// Interactive Whiteboard Block
function WhiteboardBlockInteractive({ 
  block, 
  progress,
  onSubmit 
}: { 
  block: Block; 
  progress?: BlockProgress;
  onSubmit: (data: any) => void;
}) {
  const isComplete = progress?.status === 'completed';
  
  if (isComplete) {
    return (
      <div className="p-4 bg-success/10 rounded-lg text-center">
        <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
        <p className="text-sm font-medium text-success">Whiteboard submitted</p>
        {progress?.responses?.pngDataUrl && (
          <img 
            src={progress.responses.pngDataUrl} 
            alt="Your submission" 
            className="mt-3 border rounded max-h-48 mx-auto"
          />
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {block.content?.prompt || "Draw or write your answer"}
      </p>
      <WhiteboardCanvas
        blockId={block.id}
        canvasSize={block.content?.canvasSize}
        background={block.content?.background}
        enabledTools={block.content?.enabledTools}
        multiPage={block.content?.multiPage}
        onSubmit={onSubmit}
        disabled={isComplete}
      />
    </div>
  );
}

// Interactive Reflection Block
function ReflectionBlockInteractive({ 
  block, 
  progress,
  onSubmit 
}: { 
  block: Block; 
  progress?: BlockProgress;
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const minWords = block.content?.minWords || 0;
  const maxWords = block.content?.maxWords;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const meetsMinimum = wordCount >= minWords;
  const exceedsMax = maxWords && wordCount > maxWords;

  const handleSubmit = () => {
    if (!meetsMinimum || exceedsMax) return;
    onSubmit(text);
    setSubmitted(true);
    toast.success("Reflection submitted!");
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {block.content?.prompt || "Share your reflection..."}
      </p>
      
      {block.content?.exampleResponse && (
        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground hover:text-primary">
            View example response
          </summary>
          <p className="mt-2 p-2 bg-muted rounded italic">{block.content.exampleResponse}</p>
        </details>
      )}
      
      <Textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your reflection here..."
        className="min-h-[120px]"
        disabled={submitted}
      />
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className={cn(
          !meetsMinimum && wordCount > 0 && "text-destructive",
          meetsMinimum && "text-success"
        )}>
          {wordCount} words
          {minWords > 0 && ` (min: ${minWords})`}
          {maxWords && ` (max: ${maxWords})`}
        </span>
        {exceedsMax && <span className="text-destructive">Exceeds maximum</span>}
      </div>

      {!submitted ? (
        <Button 
          onClick={handleSubmit}
          disabled={!meetsMinimum || !!exceedsMax}
          className="w-full"
        >
          Submit Reflection
        </Button>
      ) : (
        <div className="p-3 rounded-lg bg-success/10 text-success text-center">
          <CheckCircle2 className="h-5 w-5 inline mr-2" />
          Reflection submitted
        </div>
      )}
    </div>
  );
}

// Resource Block Preview
function ResourceBlockPreview({ block }: { block: Block }) {
  const fileTypeIcons: Record<string, string> = {
    pdf: '📄',
    doc: '📝',
    ppt: '📊',
    xls: '📈',
    image: '🖼️',
    zip: '📦',
    other: '📎',
  };

  const icon = fileTypeIcons[block.content?.fileType || 'other'] || '📎';
  const isLink = block.content?.resourceType === 'link';

  return (
    <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm font-medium">{block.content?.fileName || "Resource file"}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {block.content?.fileSize && <span>{block.content.fileSize}</span>}
            {block.content?.versionLabel && <span>• {block.content.versionLabel}</span>}
          </div>
        </div>
      </div>
      <Button variant="outline" size="sm">
        {isLink ? (
          <>
            <ExternalLink className="h-4 w-4 mr-1" />
            Open
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-1" />
            Download
          </>
        )}
      </Button>
    </div>
  );
}

// Q&A Thread Block Preview
function QAThreadBlockPreview({ block }: { block: Block }) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg text-center">
      <span className="text-2xl mb-2 block">💬</span>
      <p className="text-sm text-muted-foreground mb-3">Ask questions and discuss with your tutor</p>
      <Button variant="outline" size="sm" className="w-full">
        Ask a Question
      </Button>
    </div>
  );
}

// Divider Block Preview
function DividerBlockPreview({ block }: { block: Block }) {
  const style = block.content?.style || 'line';
  const spacing = block.content?.spacing || 'normal';
  
  return (
    <div className={cn(
      spacing === 'compact' && "py-2",
      spacing === 'normal' && "py-4",
      spacing === 'large' && "py-8",
    )}>
      {style === 'line' && <hr className="border-t" />}
      {style === 'whitespace' && <div className="h-8" />}
      {style === 'section-break' && (
        <div className="text-center">
          <hr className="border-t mb-4" />
          {block.content?.sectionHeading && (
            <p className="font-semibold text-lg">{block.content.sectionHeading}</p>
          )}
        </div>
      )}
    </div>
  );
}
