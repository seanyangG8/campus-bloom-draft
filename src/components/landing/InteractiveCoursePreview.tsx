import { BookOpen, Play, CheckCircle2, Circle, ChevronRight } from "lucide-react";

export function InteractiveCoursePreview() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
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
        <div className="flex-1 flex min-h-0">
          {/* Sidebar */}
          <div className="w-44 border-r bg-muted/30 p-3 flex flex-col gap-2 shrink-0">
            <div className="text-[10px] font-medium text-foreground mb-1">Course Structure</div>
            
            {/* Chapter 1 */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[9px] font-medium text-muted-foreground">
                <ChevronRight className="h-2.5 w-2.5" />
                Chapter 1: Basics
              </div>
              <div className="ml-3 space-y-0.5">
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                  <CheckCircle2 className="h-2.5 w-2.5 text-success" />
                  Introduction
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                  <CheckCircle2 className="h-2.5 w-2.5 text-success" />
                  Variables
                </div>
                <div 
                  className="flex items-center gap-1.5 text-[9px] font-medium text-foreground bg-primary/10 rounded px-1.5 py-0.5 -mx-1.5"
                  style={{ animation: "block-pulse 3s ease-in-out infinite" }}
                >
                  <Play className="h-2.5 w-2.5 text-primary" />
                  Expressions
                </div>
              </div>
            </div>

            {/* Chapter 2 */}
            <div className="space-y-1 mt-2">
              <div className="flex items-center gap-1.5 text-[9px] font-medium text-muted-foreground">
                <ChevronRight className="h-2.5 w-2.5" />
                Chapter 2: Equations
              </div>
              <div className="ml-3 space-y-0.5">
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                  <Circle className="h-2.5 w-2.5" />
                  Linear Equations
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                  <Circle className="h-2.5 w-2.5" />
                  Word Problems
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 overflow-hidden">
            {/* Page Header */}
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-foreground">Algebraic Expressions</h4>
              <p className="text-[10px] text-muted-foreground">Learn how to write and simplify expressions</p>
            </div>

            {/* Video Block */}
            <div 
              className="bg-muted/50 rounded-lg p-3 mb-3 border"
              style={{ animation: "float 4s ease-in-out infinite" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                  <Play className="h-2.5 w-2.5 text-primary" />
                </div>
                <span className="text-[10px] font-medium">Video Lesson</span>
              </div>
              <div className="aspect-video bg-foreground/5 rounded relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="h-3 w-3 text-primary-foreground ml-0.5" />
                  </div>
                </div>
                {/* Video Progress */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10">
                  <div 
                    className="h-full bg-primary rounded-r"
                    style={{ 
                      animation: "progress-grow 6s ease-in-out infinite",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quiz Block */}
            <div 
              className="bg-muted/50 rounded-lg p-3 border"
              style={{ animation: "float 4s ease-in-out infinite 0.5s" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded bg-accent/10 flex items-center justify-center">
                  <BookOpen className="h-2.5 w-2.5 text-accent" />
                </div>
                <span className="text-[10px] font-medium">Quick Check</span>
              </div>
              <p className="text-[10px] text-foreground mb-2">What is 2x + 3x?</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                  <Circle className="h-2.5 w-2.5" />
                  <span>4x</span>
                </div>
                <div 
                  className="flex items-center gap-2 text-[9px] text-foreground bg-success/10 rounded px-2 py-1 -mx-2"
                  style={{ animation: "selection-appear 4s ease-in-out infinite 2s" }}
                >
                  <CheckCircle2 className="h-2.5 w-2.5 text-success" />
                  <span className="font-medium">5x</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                  <Circle className="h-2.5 w-2.5" />
                  <span>6x</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Progress Bar */}
        <div className="h-8 border-t bg-muted/30 flex items-center px-4 gap-3 shrink-0">
          <span className="text-[10px] text-muted-foreground">Progress</span>
          <div className="flex-1 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-success rounded-full"
              style={{ animation: "progress-grow 6s ease-in-out infinite" }}
            />
          </div>
          <span 
            className="text-[10px] font-medium text-foreground tabular-nums"
            style={{ animation: "counter-tick 6s ease-in-out infinite" }}
          >
            67%
          </span>
        </div>
      </div>

      {/* Animated Cursor */}
      <div 
        className="absolute w-4 h-4 pointer-events-none z-10"
        style={{ animation: "cursor-move 8s ease-in-out infinite" }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-md">
          <path 
            d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.85a.5.5 0 0 0-.85.36Z" 
            fill="white" 
            stroke="black" 
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes cursor-move {
          0%, 100% { 
            left: 55%; 
            top: 35%; 
          }
          20% { 
            left: 60%; 
            top: 50%; 
          }
          40% { 
            left: 65%; 
            top: 65%; 
          }
          60% { 
            left: 25%; 
            top: 45%; 
          }
          80% { 
            left: 50%; 
            top: 75%; 
          }
        }

        @keyframes block-pulse {
          0%, 100% { 
            box-shadow: 0 0 0 0 hsl(var(--primary) / 0); 
          }
          50% { 
            box-shadow: 0 0 0 3px hsl(var(--primary) / 0.15); 
          }
        }

        @keyframes progress-grow {
          0%, 100% { width: 45%; }
          50% { width: 78%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        @keyframes selection-appear {
          0%, 40%, 100% { 
            opacity: 0.4; 
            background: transparent;
          }
          50%, 90% { 
            opacity: 1; 
            background: hsl(var(--success) / 0.1);
          }
        }

        @keyframes counter-tick {
          0%, 100% { content: "45%"; }
          50% { content: "78%"; }
        }
      `}</style>
    </div>
  );
}
