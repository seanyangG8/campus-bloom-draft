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
  Video
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
              brightminds.learncampus.app/course/algebra-101
            </div>
          </div>
        </div>

        {/* App Content */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Sidebar */}
          <div className="w-44 border-r bg-muted/30 p-3 flex flex-col gap-2 shrink-0 sidebar-content">
            <div className="text-[10px] font-medium text-foreground mb-1 anim-fade" style={{ "--delay": "0.3s" } as React.CSSProperties}>
              Course Structure
            </div>
            
            {/* Chapter 1 - Expands */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[9px] font-medium text-foreground cursor-pointer anim-fade" style={{ "--delay": "0.5s" } as React.CSSProperties}>
                <ChevronDown className="h-2.5 w-2.5 text-muted-foreground anim-rotate" style={{ "--delay": "1.2s" } as React.CSSProperties} />
                Chapter 1: Basics
              </div>
              
              {/* Pages reveal one by one */}
              <div className="ml-3 space-y-0.5 overflow-hidden">
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground anim-slide-down" style={{ "--delay": "1.4s" } as React.CSSProperties}>
                  <CheckCircle2 className="h-2.5 w-2.5 text-success" />
                  Introduction
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground anim-slide-down" style={{ "--delay": "1.6s" } as React.CSSProperties}>
                  <CheckCircle2 className="h-2.5 w-2.5 text-success" />
                  Variables
                </div>
                <div 
                  className="flex items-center gap-1.5 text-[9px] font-medium text-foreground rounded px-1.5 py-0.5 -mx-1.5 anim-slide-down anim-highlight" 
                  style={{ "--delay": "1.8s", "--highlight-delay": "2.5s" } as React.CSSProperties}
                >
                  <Play className="h-2.5 w-2.5 text-primary" />
                  Expressions
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground anim-slide-down" style={{ "--delay": "2s" } as React.CSSProperties}>
                  <Circle className="h-2.5 w-2.5" />
                  Practice Quiz
                </div>
              </div>
            </div>

            {/* Chapter 2 */}
            <div className="space-y-1 mt-2 anim-fade" style={{ "--delay": "2.2s" } as React.CSSProperties}>
              <div className="flex items-center gap-1.5 text-[9px] font-medium text-muted-foreground">
                <ChevronRight className="h-2.5 w-2.5" />
                Chapter 2: Equations
              </div>
            </div>

            {/* Chapter 3 */}
            <div className="space-y-1 anim-fade" style={{ "--delay": "2.4s" } as React.CSSProperties}>
              <div className="flex items-center gap-1.5 text-[9px] font-medium text-muted-foreground">
                <ChevronRight className="h-2.5 w-2.5" />
                Chapter 3: Graphing
              </div>
            </div>
          </div>

          {/* Main Content - Realistic course page */}
          <div className="flex-1 p-4 overflow-hidden relative">
            <div className="space-y-3">
              {/* Page Header */}
              <div className="mb-3 anim-fade" style={{ "--delay": "0.8s" } as React.CSSProperties}>
                <h4 className="text-sm font-semibold text-foreground">Algebraic Expressions</h4>
                <p className="text-[10px] text-muted-foreground">Learn how to write and simplify expressions</p>
              </div>

              {/* Block 1: Video Lesson */}
              <div className="bg-muted/50 rounded-lg p-3 border anim-slide-up" style={{ "--delay": "1.2s" } as React.CSSProperties}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                    <Video className="h-2.5 w-2.5 text-primary" />
                  </div>
                  <span className="text-[10px] font-medium">Understanding Expressions</span>
                  <span className="text-[9px] text-muted-foreground ml-auto">8:24</span>
                </div>
                <div className="aspect-[16/7] bg-foreground/5 rounded relative overflow-hidden">
                  {/* Video thumbnail with math content */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-foreground/40 mb-1">2x + 3y</div>
                      <div className="text-[8px] text-muted-foreground">Expression with two terms</div>
                    </div>
                  </div>
                  <div className="anim-play-button absolute inset-0 flex items-center justify-center" style={{ "--delay": "2.2s" } as React.CSSProperties}>
                    <div className="w-7 h-7 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                      <Play className="h-2.5 w-2.5 text-primary-foreground ml-0.5" />
                    </div>
                  </div>
                  {/* Video Progress */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10">
                    <div className="h-full bg-primary rounded-r anim-progress" style={{ "--delay": "3s", "--width": "72%" } as React.CSSProperties} />
                  </div>
                </div>
              </div>

              {/* Block 2: Text Content */}
              <div className="bg-muted/50 rounded-lg p-3 border anim-slide-up" style={{ "--delay": "1.5s" } as React.CSSProperties}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-accent/10 flex items-center justify-center">
                    <FileText className="h-2.5 w-2.5 text-accent" />
                  </div>
                  <span className="text-[10px] font-medium">Key Vocabulary</span>
                </div>
                <div className="space-y-1.5 text-[9px] text-muted-foreground">
                  <div className="anim-text-line" style={{ "--delay": "2.4s" } as React.CSSProperties}>
                    <span className="font-medium text-foreground">Variable:</span> A letter that represents an unknown value (x, y, n)
                  </div>
                  <div className="anim-text-line" style={{ "--delay": "2.6s" } as React.CSSProperties}>
                    <span className="font-medium text-foreground">Coefficient:</span> The number multiplied by a variable (3 in 3x)
                  </div>
                  <div className="anim-text-line" style={{ "--delay": "2.8s" } as React.CSSProperties}>
                    <span className="font-medium text-foreground">Term:</span> A single part of an expression (2x or 5)
                  </div>
                </div>
              </div>

              {/* Block 3: Drag & Drop Reorder */}
              <div className="bg-muted/50 rounded-lg p-3 border anim-slide-up" style={{ "--delay": "1.8s" } as React.CSSProperties}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-info/10 flex items-center justify-center">
                    <GripVertical className="h-2.5 w-2.5 text-info" />
                  </div>
                  <span className="text-[10px] font-medium">Order the Steps</span>
                  <span className="text-[8px] text-muted-foreground ml-auto">Drag to reorder</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 bg-background/60 rounded px-2 py-1.5 border anim-reorder-item" style={{ "--delay": "3.2s", "--move": "0px" } as React.CSSProperties}>
                    <GripVertical className="h-3 w-3 text-muted-foreground/50" />
                    <span className="text-[9px]">1. Identify like terms</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/60 rounded px-2 py-1.5 border anim-reorder-item anim-dragging" style={{ "--delay": "3.6s", "--move": "28px" } as React.CSSProperties}>
                    <GripVertical className="h-3 w-3 text-muted-foreground/50" />
                    <span className="text-[9px]">2. Combine coefficients</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/60 rounded px-2 py-1.5 border anim-reorder-item" style={{ "--delay": "3.4s", "--move": "-28px" } as React.CSSProperties}>
                    <GripVertical className="h-3 w-3 text-muted-foreground/50" />
                    <span className="text-[9px]">3. Simplify the expression</span>
                  </div>
                </div>
              </div>

              {/* Block 4: Micro Quiz */}
              <div className="bg-muted/50 rounded-lg p-3 border anim-slide-up" style={{ "--delay": "2.1s" } as React.CSSProperties}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-success/10 flex items-center justify-center">
                    <Lightbulb className="h-2.5 w-2.5 text-success" />
                  </div>
                  <span className="text-[10px] font-medium">Quick Check</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-success/10 text-success ml-auto">+5 pts</span>
                </div>
                <p className="text-[10px] text-foreground mb-2">Simplify: 4x + 2x + 3 = ?</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[9px] text-muted-foreground px-2 py-1 rounded border border-transparent">
                    <Circle className="h-2.5 w-2.5" />
                    <span>6x + 3x</span>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] px-2 py-1 rounded anim-answer-select" style={{ "--delay": "4.5s" } as React.CSSProperties}>
                    <CheckCircle2 className="h-2.5 w-2.5 anim-check" style={{ "--delay": "4.7s" } as React.CSSProperties} />
                    <span className="font-medium text-foreground">6x + 3</span>
                    <span className="ml-auto text-success text-[8px] anim-fade" style={{ "--delay": "4.9s" } as React.CSSProperties}>
                      ✓ Correct!
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-muted-foreground px-2 py-1 rounded border border-transparent">
                    <Circle className="h-2.5 w-2.5" />
                    <span>4x + 5</span>
                  </div>
                </div>
              </div>

              {/* Block 5: Reflection */}
              <div className="bg-muted/50 rounded-lg p-3 border anim-slide-up" style={{ "--delay": "2.4s" } as React.CSSProperties}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-warning/10 flex items-center justify-center">
                    <MessageSquare className="h-2.5 w-2.5 text-warning" />
                  </div>
                  <span className="text-[10px] font-medium">Reflection</span>
                  <span className="text-[8px] text-muted-foreground ml-auto">Min 50 words</span>
                </div>
                <div className="bg-background/50 rounded p-2 border text-[9px] text-muted-foreground min-h-[40px]">
                  <span className="anim-typing" style={{ "--delay": "5.2s" } as React.CSSProperties}>
                    Why is it important to combine like terms when simplifying expressions?
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 anim-fade" style={{ "--delay": "5.8s" } as React.CSSProperties}>
                  <span className="text-[8px] text-muted-foreground">Share with class</span>
                  <div className="w-6 h-3 rounded-full bg-primary/20 relative">
                    <div className="absolute right-0.5 top-0.5 w-2 h-2 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Progress Bar */}
        <div className="h-8 border-t bg-muted/30 flex items-center px-4 gap-3 shrink-0 anim-fade" style={{ "--delay": "0.6s" } as React.CSSProperties}>
          <span className="text-[10px] text-muted-foreground">Progress</span>
          <div className="flex-1 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
            <div className="h-full bg-success rounded-full anim-progress-bar" style={{ "--delay": "2.5s" } as React.CSSProperties} />
          </div>
          <span className="text-[10px] font-medium text-foreground tabular-nums min-w-[28px] text-right anim-fade" style={{ "--delay": "2.5s" } as React.CSSProperties}>
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
        .preview-container.paused .anim-reorder-item,
        .preview-container.paused .sidebar-content {
          opacity: 0;
        }

        .preview-container.animate .sidebar-content {
          animation: slide-in-left 0.6s ease-out forwards;
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
          animation: typing-reveal 1.5s ease-out forwards;
          animation-delay: var(--delay, 0s);
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
          }
          10% {
            opacity: 1;
          }
          100% { 
            opacity: 1;
          }
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
      `}</style>
    </div>
  );
}
