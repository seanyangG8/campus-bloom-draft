import { useEffect, useRef, useState } from "react";
import { 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  GripVertical,
  MessageSquare,
  Lightbulb,
  Video,
  Download
} from "lucide-react";

export function InteractiveCoursePreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    const handleScroll = () => {
      if (hasAnimated || isAnimating) return;
      
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;

      if (isVisible && window.scrollY > 50) {
        setIsAnimating(true);
        setHasAnimated(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasAnimated, isAnimating]);

  const animationClass = isAnimating ? "animate" : "paused";

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-gradient-to-br from-muted/30 to-muted/60 overflow-hidden preview-container ${animationClass}`}
    >
      {/* Browser Chrome */}
      <div className="absolute inset-4 bg-card rounded-xl shadow-lg border overflow-hidden flex flex-col">
        {/* Browser Bar */}
        <div className="h-8 bg-muted/80 flex items-center px-3 gap-2 border-b shrink-0">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/40" />
          </div>
          <div className="ml-3 flex-1 max-w-xs">
            <div className="bg-background/60 rounded px-2 py-0.5 text-[10px] text-muted-foreground">
              brightminds.learncampus.app/course/sec3-math
            </div>
          </div>
        </div>

        {/* App Content */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r bg-muted/30 p-3 flex flex-col gap-2 shrink-0 sidebar-content">
            <div className="text-[10px] font-medium text-foreground mb-1 flex items-center gap-1.5 anim-fade" style={{ "--delay": "0.3s" } as React.CSSProperties}>
              <BookOpen className="h-3 w-3 text-primary" />
              Sec 3 Mathematics
            </div>
            
            {/* Chapter 1 - Expands */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[9px] font-medium text-foreground cursor-pointer anim-fade" style={{ "--delay": "0.5s" } as React.CSSProperties}>
                <ChevronDown className="h-2.5 w-2.5 text-muted-foreground anim-rotate" style={{ "--delay": "1.2s" } as React.CSSProperties} />
                <span>Ch 1: Algebra Fundamentals</span>
              </div>
              
              {/* Pages reveal one by one */}
              <div className="ml-4 space-y-0.5 overflow-hidden">
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground anim-slide-down" style={{ "--delay": "1.4s" } as React.CSSProperties}>
                  <CheckCircle2 className="h-2.5 w-2.5 text-success" />
                  <span>1.1 Introduction to Algebra</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground anim-slide-down" style={{ "--delay": "1.6s" } as React.CSSProperties}>
                  <CheckCircle2 className="h-2.5 w-2.5 text-success" />
                  <span>1.2 Variables & Constants</span>
                </div>
                <div 
                  className="flex items-center gap-1.5 text-[9px] font-medium text-foreground rounded px-1.5 py-0.5 -mx-1.5 anim-slide-down anim-highlight" 
                  style={{ "--delay": "1.8s", "--highlight-delay": "2.5s" } as React.CSSProperties}
                >
                  <Play className="h-2.5 w-2.5 text-primary" />
                  <span>1.3 Algebraic Expressions</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground anim-slide-down" style={{ "--delay": "2s" } as React.CSSProperties}>
                  <Circle className="h-2.5 w-2.5" />
                  <span>1.4 Simplifying Expressions</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground anim-slide-down" style={{ "--delay": "2.1s" } as React.CSSProperties}>
                  <Circle className="h-2.5 w-2.5" />
                  <span>Chapter Quiz</span>
                </div>
              </div>
            </div>

            {/* Chapter 2 */}
            <div className="space-y-1 mt-1 anim-fade" style={{ "--delay": "2.3s" } as React.CSSProperties}>
              <div className="flex items-center gap-1.5 text-[9px] font-medium text-muted-foreground">
                <ChevronRight className="h-2.5 w-2.5" />
                <span>Ch 2: Linear Equations</span>
              </div>
            </div>

            {/* Chapter 3 */}
            <div className="space-y-1 anim-fade" style={{ "--delay": "2.5s" } as React.CSSProperties}>
              <div className="flex items-center gap-1.5 text-[9px] font-medium text-muted-foreground">
                <ChevronRight className="h-2.5 w-2.5" />
                <span>Ch 3: Simultaneous Equations</span>
              </div>
            </div>

            {/* Chapter 4 */}
            <div className="space-y-1 anim-fade" style={{ "--delay": "2.6s" } as React.CSSProperties}>
              <div className="flex items-center gap-1.5 text-[9px] font-medium text-muted-foreground">
                <ChevronRight className="h-2.5 w-2.5" />
                <span>Ch 4: Quadratic Expressions</span>
              </div>
            </div>
          </div>

          {/* Main Content - Realistic course page with scroll animation */}
          <div className="flex-1 p-4 overflow-hidden relative">
            <div className="space-y-3 content-scroll-container anim-content-scroll" style={{ "--scroll-delay": "3.8s" } as React.CSSProperties}>
              {/* Page Header */}
              <div className="mb-3 anim-fade" style={{ "--delay": "0.8s" } as React.CSSProperties}>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-foreground">1.3 Algebraic Expressions</h4>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">Required</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Learn to identify, write, and interpret algebraic expressions. By the end of this lesson, you'll be able to identify coefficients, variables, and constants in any expression.
                </p>
              </div>

              {/* Block 1: Video Lesson with Whiteboard Content */}
              <div className="bg-muted/50 rounded-lg p-3 border anim-slide-up" style={{ "--delay": "1.2s" } as React.CSSProperties}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                    <Video className="h-2.5 w-2.5 text-primary" />
                  </div>
                  <span className="text-[10px] font-medium">Video: Understanding Algebraic Expressions</span>
                  <span className="text-[9px] text-muted-foreground ml-auto">8:24</span>
                </div>
                <div className="aspect-[16/6] bg-slate-900 rounded relative overflow-hidden">
                  {/* Whiteboard-style video thumbnail */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 p-3">
                    {/* Tutor avatar */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 anim-fade" style={{ "--delay": "2.4s" } as React.CSSProperties}>
                      <div className="w-5 h-5 rounded-full bg-primary/80 flex items-center justify-center">
                        <span className="text-[7px] font-medium text-primary-foreground">AR</span>
                      </div>
                      <span className="text-[8px] text-slate-400">Mr. Ahmad</span>
                    </div>
                    
                    {/* Whiteboard content - expression breakdown */}
                    <div className="flex flex-col items-center justify-center h-full pt-2">
                      <div className="text-center anim-math-reveal" style={{ "--delay": "2.6s" } as React.CSSProperties}>
                        <div className="text-lg font-mono text-white mb-2 tracking-wider">
                          <span className="text-blue-400">4</span><span className="text-green-400">x²</span> 
                          <span className="text-white/60"> + </span>
                          <span className="text-blue-400">3</span><span className="text-green-400">x</span>
                          <span className="text-white/60"> − </span>
                          <span className="text-orange-400">7</span>
                        </div>
                        {/* Labels */}
                        <div className="flex justify-center gap-4 text-[7px] mt-1">
                          <div className="flex flex-col items-center">
                            <div className="w-px h-2 bg-blue-400/50" />
                            <span className="text-blue-400">coefficient</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-px h-2 bg-green-400/50" />
                            <span className="text-green-400">variable</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-px h-2 bg-orange-400/50" />
                            <span className="text-orange-400">constant</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Play button overlay */}
                  <div className="anim-play-button absolute inset-0 flex items-center justify-center bg-black/20" style={{ "--delay": "2.2s" } as React.CSSProperties}>
                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play className="h-3 w-3 text-slate-900 ml-0.5" />
                    </div>
                  </div>
                  
                  {/* Video Progress */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-primary rounded-r anim-progress" style={{ "--delay": "3s", "--width": "72%" } as React.CSSProperties} />
                  </div>
                </div>
                {/* Watched indicator */}
                <div className="flex items-center gap-1.5 mt-2 anim-fade" style={{ "--delay": "3.5s" } as React.CSSProperties}>
                  <CheckCircle2 className="h-3 w-3 text-success" />
                  <span className="text-[9px] text-muted-foreground">Watched</span>
                </div>
              </div>

              {/* Block 2: Key Concepts - Text Content */}
              <div className="bg-muted/50 rounded-lg p-3 border anim-slide-up" style={{ "--delay": "1.5s" } as React.CSSProperties}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-accent/10 flex items-center justify-center">
                    <FileText className="h-2.5 w-2.5 text-accent-foreground" />
                  </div>
                  <span className="text-[10px] font-medium">Key Terms to Remember</span>
                </div>
                <div className="space-y-2 text-[9px]">
                  <div className="anim-text-line flex gap-2" style={{ "--delay": "2.8s" } as React.CSSProperties}>
                    <span className="font-semibold text-foreground min-w-[70px]">Variable</span>
                    <span className="text-muted-foreground">A letter representing an unknown value (e.g., <span className="font-mono text-foreground">x</span>, <span className="font-mono text-foreground">y</span>, <span className="font-mono text-foreground">n</span>)</span>
                  </div>
                  <div className="anim-text-line flex gap-2" style={{ "--delay": "3s" } as React.CSSProperties}>
                    <span className="font-semibold text-foreground min-w-[70px]">Coefficient</span>
                    <span className="text-muted-foreground">The number in front of a variable (e.g., <span className="font-mono text-foreground">3</span> in <span className="font-mono text-foreground">3x</span>)</span>
                  </div>
                  <div className="anim-text-line flex gap-2" style={{ "--delay": "3.2s" } as React.CSSProperties}>
                    <span className="font-semibold text-foreground min-w-[70px]">Constant</span>
                    <span className="text-muted-foreground">A fixed number with no variable (e.g., <span className="font-mono text-foreground">+5</span> or <span className="font-mono text-foreground">−2</span>)</span>
                  </div>
                  <div className="anim-text-line flex gap-2" style={{ "--delay": "3.4s" } as React.CSSProperties}>
                    <span className="font-semibold text-foreground min-w-[70px]">Like Terms</span>
                    <span className="text-muted-foreground">Terms with identical variables and powers (<span className="font-mono text-foreground">3x</span> and <span className="font-mono text-foreground">5x</span>)</span>
                  </div>
                </div>
              </div>

              {/* Block 3: Micro Quiz - Quick Check */}
              <div className="bg-muted/50 rounded-lg p-3 border anim-slide-up" style={{ "--delay": "1.8s" } as React.CSSProperties}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-success/10 flex items-center justify-center">
                    <Lightbulb className="h-2.5 w-2.5 text-success" />
                  </div>
                  <span className="text-[10px] font-medium">Quick Check</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-success/10 text-success ml-auto anim-fade" style={{ "--delay": "6.2s" } as React.CSSProperties}>+5 pts</span>
                </div>
                <p className="text-[10px] text-foreground mb-2">
                  In the expression <span className="font-mono font-semibold">5y − 2</span>, what is the coefficient of <span className="font-mono">y</span>?
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[9px] text-muted-foreground px-2 py-1 rounded border border-transparent">
                    <Circle className="h-2.5 w-2.5" />
                    <span className="font-mono">y</span>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] px-2 py-1 rounded border anim-answer-select" style={{ "--delay": "5.5s" } as React.CSSProperties}>
                    <CheckCircle2 className="h-2.5 w-2.5 anim-check" style={{ "--delay": "5.7s" } as React.CSSProperties} />
                    <span className="font-mono font-medium text-foreground">5</span>
                    <span className="ml-auto text-success text-[8px] anim-fade" style={{ "--delay": "5.9s" } as React.CSSProperties}>
                      ✓ Correct!
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-muted-foreground px-2 py-1 rounded border border-transparent">
                    <Circle className="h-2.5 w-2.5" />
                    <span className="font-mono">−2</span>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-muted-foreground px-2 py-1 rounded border border-transparent">
                    <Circle className="h-2.5 w-2.5" />
                    <span className="font-mono">5y</span>
                  </div>
                </div>
                {/* Feedback */}
                <div className="mt-2 p-2 bg-success/5 rounded border border-success/20 anim-fade" style={{ "--delay": "6.2s" } as React.CSSProperties}>
                  <p className="text-[9px] text-success">The coefficient is the number multiplied by the variable. In 5y, the coefficient is 5.</p>
                </div>
              </div>

              {/* Block 4: Drag & Drop Reorder - Simplification Steps */}
              <div className="bg-muted/50 rounded-lg p-3 border anim-slide-up" style={{ "--delay": "2.1s" } as React.CSSProperties}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-info/10 flex items-center justify-center">
                    <GripVertical className="h-2.5 w-2.5 text-info" />
                  </div>
                  <span className="text-[10px] font-medium">Order the Simplification Steps</span>
                  <span className="text-[8px] text-muted-foreground ml-auto">Drag to reorder</span>
                </div>
                <p className="text-[9px] text-muted-foreground mb-2">
                  Arrange these steps to simplify: <span className="font-mono text-foreground">2a + 3b − a + 4b</span>
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 bg-background/60 rounded px-2 py-1.5 border anim-reorder-item" style={{ "--delay": "6.8s", "--move": "0px" } as React.CSSProperties}>
                    <GripVertical className="h-3 w-3 text-muted-foreground/50" />
                    <span className="text-[9px]">1. Identify like terms: (2a, −a) and (3b, 4b)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/60 rounded px-2 py-1.5 border anim-reorder-item" style={{ "--delay": "7s", "--move": "0px" } as React.CSSProperties}>
                    <GripVertical className="h-3 w-3 text-muted-foreground/50" />
                    <span className="text-[9px]">2. Combine: 2a − a = a</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/60 rounded px-2 py-1.5 border anim-reorder-item anim-dragging" style={{ "--delay": "7.2s", "--move": "28px" } as React.CSSProperties}>
                    <GripVertical className="h-3 w-3 text-muted-foreground/50" />
                    <span className="text-[9px]">3. Combine: 3b + 4b = 7b</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/60 rounded px-2 py-1.5 border anim-reorder-item" style={{ "--delay": "7.4s", "--move": "-28px" } as React.CSSProperties}>
                    <GripVertical className="h-3 w-3 text-muted-foreground/50" />
                    <span className="text-[9px]">4. Final answer: <span className="font-mono font-medium">a + 7b</span></span>
                  </div>
                </div>
                {/* Success indicator */}
                <div className="flex items-center gap-1.5 mt-2 anim-fade" style={{ "--delay": "8s" } as React.CSSProperties}>
                  <CheckCircle2 className="h-3 w-3 text-success" />
                  <span className="text-[9px] text-success">Correct order!</span>
                </div>
              </div>

              {/* Block 5: Reflection Prompt */}
              <div className="bg-muted/50 rounded-lg p-3 border anim-slide-up" style={{ "--delay": "2.4s" } as React.CSSProperties}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-warning/10 flex items-center justify-center">
                    <MessageSquare className="h-2.5 w-2.5 text-warning" />
                  </div>
                  <span className="text-[10px] font-medium">Reflection</span>
                  <span className="text-[8px] text-muted-foreground ml-auto">Min 50 words</span>
                </div>
                <p className="text-[9px] text-muted-foreground mb-2">
                  Why is it important to identify like terms before simplifying an algebraic expression?
                </p>
                <div className="bg-background/50 rounded p-2 border text-[9px] text-foreground min-h-[36px]">
                  <span className="text-muted-foreground">Type your response...</span>
                </div>
              </div>

              {/* Block 6: Resource Download */}
              <div className="bg-muted/50 rounded-lg p-3 border anim-slide-up" style={{ "--delay": "2.7s" } as React.CSSProperties}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-blue-500/10 flex items-center justify-center">
                    <Download className="h-2.5 w-2.5 text-blue-600" />
                  </div>
                  <span className="text-[10px] font-medium">Practice Worksheet</span>
                </div>
                <div className="flex items-center gap-3 bg-background/50 rounded p-2 border">
                  <div className="w-8 h-10 bg-red-500/10 rounded flex items-center justify-center">
                    <FileText className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-medium text-foreground truncate">Algebraic_Expressions_Practice.pdf</p>
                    <p className="text-[8px] text-muted-foreground">12 practice questions with answers</p>
                  </div>
                  <button className="px-2 py-1 text-[8px] bg-primary text-primary-foreground rounded hover:bg-primary/90">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Progress Bar */}
        <div className="h-8 border-t bg-muted/30 flex items-center px-4 gap-3 shrink-0 anim-fade" style={{ "--delay": "0.6s" } as React.CSSProperties}>
          <span className="text-[10px] text-muted-foreground">Lesson Progress</span>
          <div className="flex-1 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
            <div className="h-full bg-success rounded-full anim-progress-bar" style={{ "--delay": "2.5s" } as React.CSSProperties} />
          </div>
          <span className="text-[10px] font-medium text-foreground tabular-nums min-w-[28px] text-right anim-counter" style={{ "--delay": "2.5s" } as React.CSSProperties}>
            67%
          </span>
        </div>
      </div>

      {/* CSS Animations - Only run when triggered */}
      <style>{`
        .preview-container.paused .anim-fade,
        .preview-container.paused .anim-slide-up,
        .preview-container.paused .anim-slide-down,
        .preview-container.paused .anim-rotate,
        .preview-container.paused .anim-highlight,
        .preview-container.paused .anim-text-line,
        .preview-container.paused .anim-progress,
        .preview-container.paused .anim-progress-bar,
        .preview-container.paused .anim-play-button,
        .preview-container.paused .anim-answer-select,
        .preview-container.paused .anim-check,
        .preview-container.paused .anim-typing,
        .preview-container.paused .anim-cursor,
        .preview-container.paused .anim-reorder-item,
        .preview-container.paused .anim-math-reveal,
        .preview-container.paused .anim-counter,
        .preview-container.paused .anim-content-scroll,
        .preview-container.paused .sidebar-content {
          opacity: 0;
        }

        .preview-container.paused .anim-content-scroll {
          opacity: 1;
        }

        .preview-container.animate .sidebar-content {
          animation: slide-in-left 0.6s ease-out forwards;
        }

        .preview-container.animate .anim-content-scroll {
          animation: content-scroll 4s ease-in-out forwards;
          animation-delay: var(--scroll-delay, 3.5s);
        }

        .preview-container.animate .anim-fade {
          animation: fade-in 0.4s ease-out forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
        }

        .preview-container.animate .anim-slide-up {
          animation: slide-up-fade 0.5s ease-out forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
        }

        .preview-container.animate .anim-slide-down {
          animation: slide-down-fade 0.3s ease-out forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
        }

        .preview-container.animate .anim-rotate {
          animation: rotate-down 0.3s ease-out forwards;
          animation-delay: var(--delay, 0s);
          transform: rotate(-90deg);
        }

        .preview-container.animate .anim-highlight {
          animation: fade-in 0.3s ease-out forwards, highlight-active 0.4s ease-out forwards;
          animation-delay: var(--delay, 0s), var(--highlight-delay, 0s);
          opacity: 0;
        }

        .preview-container.animate .anim-text-line {
          animation: text-line-reveal 0.4s ease-out forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
          transform: translateX(-8px);
        }

        .preview-container.animate .anim-progress {
          animation: progress-fill 1.5s ease-out forwards;
          animation-delay: var(--delay, 0s);
          width: 0;
        }

        .preview-container.animate .anim-progress-bar {
          animation: progress-bar-grow 2s ease-out forwards;
          animation-delay: var(--delay, 0s);
          width: 33%;
        }

        .preview-container.animate .anim-play-button {
          animation: scale-in 0.3s ease-out forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
          transform: scale(0.8);
        }

        .preview-container.animate .anim-answer-select {
          animation: answer-select 0.4s ease-out forwards;
          animation-delay: var(--delay, 0s);
          background: transparent;
        }

        .preview-container.animate .anim-check {
          animation: check-appear 0.3s ease-out forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
          transform: scale(0);
        }

        .preview-container.animate .anim-typing {
          animation: typing-reveal 2s ease-out forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
        }

        .preview-container.animate .anim-cursor {
          animation: cursor-blink 0.5s step-end infinite, fade-in 0.1s ease-out forwards;
          animation-delay: calc(var(--delay, 0s) + 0.5s);
          opacity: 0;
        }

        .preview-container.animate .anim-reorder-item {
          animation: reorder-slide 0.5s ease-out forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
        }

        .preview-container.animate .anim-reorder-item.anim-dragging {
          animation: reorder-slide 0.5s ease-out forwards, drag-effect 0.8s ease-in-out forwards;
          animation-delay: var(--delay, 0s), calc(var(--delay, 0s) + 0.8s);
        }

        .preview-container.animate .anim-math-reveal {
          animation: math-reveal 0.6s ease-out forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
        }

        .preview-container.animate .anim-counter {
          animation: fade-in 0.4s ease-out forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
        }

        @keyframes slide-in-left {
          from { 
            opacity: 0;
            transform: translateX(-20px); 
          }
          to { 
            opacity: 1;
            transform: translateX(0); 
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up-fade {
          from { 
            opacity: 0;
            transform: translateY(16px); 
          }
          to { 
            opacity: 1;
            transform: translateY(0); 
          }
        }

        @keyframes slide-down-fade {
          from { 
            opacity: 0;
            transform: translateY(-8px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rotate-down {
          from { transform: rotate(-90deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes highlight-active {
          from { background: transparent; }
          to { background: hsl(var(--primary) / 0.1); }
        }

        @keyframes text-line-reveal {
          from { 
            opacity: 0;
            transform: translateX(-8px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes progress-fill {
          from { width: 0; }
          to { width: var(--width, 65%); }
        }

        @keyframes progress-bar-grow {
          from { width: 33%; }
          to { width: 67%; }
        }

        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.8);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes answer-select {
          from { 
            background: transparent;
            border-color: transparent;
          }
          to { 
            background: hsl(var(--success) / 0.1);
            border-color: hsl(var(--success) / 0.3);
          }
        }

        @keyframes check-appear {
          from { 
            opacity: 0;
            transform: scale(0);
          }
          to { 
            opacity: 1;
            transform: scale(1);
            color: hsl(var(--success));
          }
        }

        @keyframes typing-reveal {
          0% { 
            opacity: 0;
            max-width: 0;
          }
          5% {
            opacity: 1;
            max-width: 0;
          }
          100% { 
            opacity: 1;
            max-width: 100%;
          }
        }

        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes reorder-slide {
          from { 
            opacity: 0;
            transform: translateY(8px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes drag-effect {
          0% { 
            transform: translateY(0);
            box-shadow: none;
          }
          30% { 
            transform: translateY(var(--move, 0));
            box-shadow: 0 4px 12px hsl(var(--foreground) / 0.1);
            background: hsl(var(--background));
          }
          70% {
            transform: translateY(var(--move, 0));
            box-shadow: 0 4px 12px hsl(var(--foreground) / 0.1);
          }
          100% { 
            transform: translateY(0);
            box-shadow: none;
          }
        }

        @keyframes math-reveal {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes content-scroll {
          0% {
            transform: translateY(0);
          }
          20% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-320px);
          }
          80% {
            transform: translateY(-320px);
          }
          100% {
            transform: translateY(-320px);
          }
        }
      `}</style>
    </div>
  );
}
