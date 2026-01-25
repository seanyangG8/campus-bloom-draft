import { BookOpen, Play, CheckCircle2, Circle, ChevronRight, ChevronDown, FileText, PenTool } from "lucide-react";

export function InteractiveCoursePreview() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-muted/30 to-muted/60 overflow-hidden">
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
          {/* Sidebar - Animates in from left */}
          <div 
            className="w-44 border-r bg-muted/30 p-3 flex flex-col gap-2 shrink-0"
            style={{ animation: "slide-in-left 0.6s ease-out forwards" }}
          >
            <div 
              className="text-[10px] font-medium text-foreground mb-1"
              style={{ animation: "fade-in 0.4s ease-out 0.3s both" }}
            >
              Course Structure
            </div>
            
            {/* Chapter 1 - Expands */}
            <div className="space-y-1">
              <div 
                className="flex items-center gap-1.5 text-[9px] font-medium text-foreground cursor-pointer"
                style={{ animation: "fade-in 0.4s ease-out 0.5s both" }}
              >
                <ChevronDown 
                  className="h-2.5 w-2.5 text-muted-foreground transition-transform"
                  style={{ animation: "rotate-down 0.3s ease-out 1.2s both" }}
                />
                Chapter 1: Basics
              </div>
              
              {/* Pages reveal one by one */}
              <div className="ml-3 space-y-0.5 overflow-hidden">
                <div 
                  className="flex items-center gap-1.5 text-[9px] text-muted-foreground"
                  style={{ animation: "slide-down-fade 0.3s ease-out 1.4s both" }}
                >
                  <CheckCircle2 className="h-2.5 w-2.5 text-success" />
                  Introduction
                </div>
                <div 
                  className="flex items-center gap-1.5 text-[9px] text-muted-foreground"
                  style={{ animation: "slide-down-fade 0.3s ease-out 1.6s both" }}
                >
                  <CheckCircle2 className="h-2.5 w-2.5 text-success" />
                  Variables
                </div>
                <div 
                  className="flex items-center gap-1.5 text-[9px] font-medium text-foreground rounded px-1.5 py-0.5 -mx-1.5 transition-colors"
                  style={{ animation: "slide-down-fade 0.3s ease-out 1.8s both, highlight-active 0.4s ease-out 2.5s both" }}
                >
                  <Play className="h-2.5 w-2.5 text-primary" />
                  Expressions
                </div>
                <div 
                  className="flex items-center gap-1.5 text-[9px] text-muted-foreground"
                  style={{ animation: "slide-down-fade 0.3s ease-out 2s both" }}
                >
                  <Circle className="h-2.5 w-2.5" />
                  Practice Quiz
                </div>
              </div>
            </div>

            {/* Chapter 2 - Stays collapsed initially */}
            <div 
              className="space-y-1 mt-2"
              style={{ animation: "fade-in 0.4s ease-out 2.2s both" }}
            >
              <div className="flex items-center gap-1.5 text-[9px] font-medium text-muted-foreground">
                <ChevronRight className="h-2.5 w-2.5" />
                Chapter 2: Equations
              </div>
            </div>

            {/* Chapter 3 */}
            <div 
              className="space-y-1"
              style={{ animation: "fade-in 0.4s ease-out 2.4s both" }}
            >
              <div className="flex items-center gap-1.5 text-[9px] font-medium text-muted-foreground">
                <ChevronRight className="h-2.5 w-2.5" />
                Chapter 3: Graphing
              </div>
            </div>
          </div>

          {/* Main Content - Builds up progressively */}
          <div className="flex-1 p-4 overflow-hidden relative">
            {/* Scroll container that animates */}
            <div 
              className="space-y-3"
              style={{ animation: "content-scroll 8s ease-in-out 3s infinite" }}
            >
              {/* Page Header - Fades in first */}
              <div 
                className="mb-3"
                style={{ animation: "fade-in 0.5s ease-out 0.8s both" }}
              >
                <h4 className="text-sm font-semibold text-foreground">Algebraic Expressions</h4>
                <p className="text-[10px] text-muted-foreground">Learn how to write and simplify expressions</p>
              </div>

              {/* Video Block - Slides up */}
              <div 
                className="bg-muted/50 rounded-lg p-3 border"
                style={{ animation: "slide-up-fade 0.5s ease-out 1.2s both" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                    <Play className="h-2.5 w-2.5 text-primary" />
                  </div>
                  <span className="text-[10px] font-medium">Video Lesson</span>
                  <span className="text-[9px] text-muted-foreground ml-auto">12:34</span>
                </div>
                <div className="aspect-video bg-foreground/5 rounded relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center"
                      style={{ animation: "scale-pulse 2s ease-in-out 2s infinite" }}
                    >
                      <Play className="h-3 w-3 text-primary-foreground ml-0.5" />
                    </div>
                  </div>
                  {/* Video Progress - Fills up */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10">
                    <div 
                      className="h-full bg-primary rounded-r"
                      style={{ animation: "progress-fill 4s ease-out 3s both" }}
                    />
                  </div>
                </div>
              </div>

              {/* Text Block - Slides up with delay */}
              <div 
                className="bg-muted/50 rounded-lg p-3 border"
                style={{ animation: "slide-up-fade 0.5s ease-out 1.6s both" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-accent/10 flex items-center justify-center">
                    <FileText className="h-2.5 w-2.5 text-accent" />
                  </div>
                  <span className="text-[10px] font-medium">Key Concepts</span>
                </div>
                <div className="space-y-1.5">
                  <div 
                    className="h-2 bg-foreground/10 rounded w-full"
                    style={{ animation: "text-reveal 0.4s ease-out 2s both" }}
                  />
                  <div 
                    className="h-2 bg-foreground/10 rounded w-4/5"
                    style={{ animation: "text-reveal 0.4s ease-out 2.15s both" }}
                  />
                  <div 
                    className="h-2 bg-foreground/10 rounded w-11/12"
                    style={{ animation: "text-reveal 0.4s ease-out 2.3s both" }}
                  />
                </div>
              </div>

              {/* Quiz Block - Slides up and answers select */}
              <div 
                className="bg-muted/50 rounded-lg p-3 border"
                style={{ animation: "slide-up-fade 0.5s ease-out 2s both" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-success/10 flex items-center justify-center">
                    <PenTool className="h-2.5 w-2.5 text-success" />
                  </div>
                  <span className="text-[10px] font-medium">Quick Check</span>
                </div>
                <p className="text-[10px] text-foreground mb-2">Simplify: 2x + 3x = ?</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[9px] text-muted-foreground px-2 py-1 rounded">
                    <Circle className="h-2.5 w-2.5" />
                    <span>4x</span>
                  </div>
                  <div 
                    className="flex items-center gap-2 text-[9px] text-foreground px-2 py-1 rounded transition-all"
                    style={{ animation: "answer-select 0.4s ease-out 4s both" }}
                  >
                    <CheckCircle2 
                      className="h-2.5 w-2.5"
                      style={{ animation: "check-appear 0.3s ease-out 4.2s both" }}
                    />
                    <span className="font-medium">5x</span>
                    <span 
                      className="ml-auto text-success text-[8px]"
                      style={{ animation: "fade-in 0.3s ease-out 4.4s both" }}
                    >
                      Correct!
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-muted-foreground px-2 py-1 rounded">
                    <Circle className="h-2.5 w-2.5" />
                    <span>6x</span>
                  </div>
                </div>
              </div>

              {/* Reflection Block - Final reveal */}
              <div 
                className="bg-muted/50 rounded-lg p-3 border"
                style={{ animation: "slide-up-fade 0.5s ease-out 2.4s both" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-warning/10 flex items-center justify-center">
                    <BookOpen className="h-2.5 w-2.5 text-warning" />
                  </div>
                  <span className="text-[10px] font-medium">Reflection</span>
                </div>
                <div 
                  className="bg-background/50 rounded p-2 border border-dashed text-[9px] text-muted-foreground"
                  style={{ animation: "typing-cursor 1s steps(1) 5s infinite" }}
                >
                  <span style={{ animation: "typing 2s steps(20) 5s both" }}>
                    In your own words, explain...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Progress Bar - Fills as content loads */}
        <div 
          className="h-8 border-t bg-muted/30 flex items-center px-4 gap-3 shrink-0"
          style={{ animation: "fade-in 0.4s ease-out 0.6s both" }}
        >
          <span className="text-[10px] text-muted-foreground">Progress</span>
          <div className="flex-1 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-success rounded-full"
              style={{ animation: "progress-bar-grow 5s ease-out 2.5s both" }}
            />
          </div>
          <span 
            className="text-[10px] font-medium text-foreground tabular-nums min-w-[28px] text-right"
          >
            <span style={{ animation: "counter-up 5s ease-out 2.5s both" }}>67%</span>
          </span>
        </div>
      </div>

      {/* CSS Animations - All building/revealing, no cursor */}
      <style>{`
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
            max-height: 0;
          }
          to { 
            opacity: 1;
            transform: translateY(0);
            max-height: 24px;
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

        @keyframes text-reveal {
          from { 
            width: 0;
            opacity: 0;
          }
          to { 
            width: 100%;
            opacity: 1;
          }
        }

        @keyframes progress-fill {
          from { width: 0%; }
          to { width: 65%; }
        }

        @keyframes progress-bar-grow {
          0% { width: 33%; }
          100% { width: 67%; }
        }

        @keyframes scale-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes answer-select {
          from { 
            background: transparent;
          }
          to { 
            background: hsl(var(--success) / 0.1);
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

        @keyframes typing-cursor {
          0%, 100% { border-right: 2px solid hsl(var(--foreground) / 0.5); }
          50% { border-right: 2px solid transparent; }
        }

        @keyframes typing {
          from { max-width: 0; }
          to { max-width: 200px; }
        }

        @keyframes content-scroll {
          0%, 20% { transform: translateY(0); }
          40%, 60% { transform: translateY(-30px); }
          80%, 100% { transform: translateY(0); }
        }

        @keyframes counter-up {
          0% { opacity: 0; }
          10% { opacity: 1; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
