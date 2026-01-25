import { useEffect, useRef, useState } from "react";
import { 
  TrendingUp, 
  BookOpen, 
  Clock,
  Flame,
  Star,
  Target,
  Zap,
  CheckCircle2,
} from "lucide-react";

export function ParentProgressPreview() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (hasAnimated || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
      
      if (isVisible && window.scrollY > 50) {
        setIsAnimating(true);
        setHasAnimated(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated]);

  const animationClass = isAnimating ? "animate" : "paused";

  return (
    <div 
      ref={containerRef}
      className={`parent-preview-container relative w-full h-full bg-gradient-to-br from-muted/30 to-muted/50 overflow-hidden ${animationClass}`}
    >
      {/* Browser Chrome - Always visible */}
      <div className="absolute inset-3 bg-background rounded-lg shadow-lg border overflow-hidden flex flex-col">
        {/* Status Bar */}
        <div className="h-8 bg-muted/50 border-b flex items-center px-3 gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-background/80 rounded px-3 py-0.5 text-[10px] text-muted-foreground">
              app.learncampus.com/parent/progress
            </div>
          </div>
        </div>

        {/* Progress Content */}
        <div className="flex-1 p-3 overflow-hidden">
          {/* Header - Always visible */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">SC</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Sarah's Progress</h2>
              <p className="text-[10px] text-muted-foreground">Secondary 3 • This semester</p>
            </div>
          </div>

          {/* Stats Row - Individual cards animate with inline delays */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="anim-slide-up bg-card rounded-md border p-2" style={{ "--delay": "0.2s" } as React.CSSProperties}>
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Overall</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-semibold">72%</span>
                <span className="text-[8px] text-success">+5%</span>
              </div>
            </div>
            <div className="anim-slide-up bg-card rounded-md border p-2" style={{ "--delay": "0.3s" } as React.CSSProperties}>
              <div className="flex items-center gap-1 mb-1">
                <BookOpen className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Courses</span>
              </div>
              <span className="text-base font-semibold">2</span>
            </div>
            <div className="anim-slide-up bg-card rounded-md border p-2" style={{ "--delay": "0.4s" } as React.CSSProperties}>
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Hours</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-semibold">48</span>
                <span className="text-[8px] text-success">+8</span>
              </div>
            </div>
            <div className="anim-slide-up bg-card rounded-md border p-2" style={{ "--delay": "0.5s" } as React.CSSProperties}>
              <div className="flex items-center gap-1 mb-1">
                <Flame className="h-3 w-3 text-warning" />
                <span className="text-[9px] text-muted-foreground">Streak</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-semibold">12</span>
                <span className="text-[8px]">🔥</span>
              </div>
            </div>
          </div>

          {/* Course Progress Cards - Cards animate, then progress fills */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="anim-slide-up bg-card rounded-md border p-2" style={{ "--delay": "0.7s" } as React.CSSProperties}>
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <p className="text-[10px] font-medium">Sec 3 Mathematics</p>
                  <p className="text-[8px] text-muted-foreground">6 of 8 chapters</p>
                </div>
                <div className="w-8 h-8 relative">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="16" cy="16" r="12" fill="none" stroke="hsl(var(--muted))" strokeWidth="2.5" />
                    <circle 
                      cx="16" cy="16" r="12" fill="none" 
                      stroke="hsl(var(--primary))" strokeWidth="2.5"
                      strokeDasharray="75.4" 
                      className="anim-ring"
                      style={{ "--delay": "1.1s", "--target-offset": "16.6" } as React.CSSProperties}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-semibold">78%</span>
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="anim-progress h-full bg-primary rounded-full" style={{ "--delay": "1.1s", "--width": "78%" } as React.CSSProperties} />
              </div>
            </div>
            <div className="anim-slide-up bg-card rounded-md border p-2" style={{ "--delay": "0.8s" } as React.CSSProperties}>
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <p className="text-[10px] font-medium">Pri 6 Science</p>
                  <p className="text-[8px] text-muted-foreground">4 of 10 chapters</p>
                </div>
                <div className="w-8 h-8 relative">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="16" cy="16" r="12" fill="none" stroke="hsl(var(--muted))" strokeWidth="2.5" />
                    <circle 
                      cx="16" cy="16" r="12" fill="none" 
                      stroke="hsl(var(--success))" strokeWidth="2.5"
                      strokeDasharray="75.4" 
                      className="anim-ring"
                      style={{ "--delay": "1.2s", "--target-offset": "41.5" } as React.CSSProperties}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-semibold">45%</span>
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="anim-progress h-full bg-success rounded-full" style={{ "--delay": "1.2s", "--width": "45%" } as React.CSSProperties} />
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Achievements - Badges pop in */}
            <div className="anim-slide-up bg-card rounded-md border p-2" style={{ "--delay": "1.4s" } as React.CSSProperties}>
              <p className="text-[10px] font-medium mb-2">Achievements</p>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="anim-badge flex items-center gap-1 p-1.5 rounded bg-success/10" style={{ "--delay": "1.8s" } as React.CSSProperties}>
                  <Zap className="h-3 w-3 text-success" />
                  <span className="text-[8px]">Quick Learner</span>
                  <CheckCircle2 className="h-2.5 w-2.5 text-success ml-auto" />
                </div>
                <div className="anim-badge flex items-center gap-1 p-1.5 rounded bg-primary/10" style={{ "--delay": "1.9s" } as React.CSSProperties}>
                  <Target className="h-3 w-3 text-primary" />
                  <span className="text-[8px]">Perfect Quiz</span>
                  <CheckCircle2 className="h-2.5 w-2.5 text-primary ml-auto" />
                </div>
                <div className="anim-badge flex items-center gap-1 p-1.5 rounded bg-warning/10" style={{ "--delay": "2.0s" } as React.CSSProperties}>
                  <Flame className="h-3 w-3 text-warning" />
                  <span className="text-[8px]">7-Day Streak</span>
                  <CheckCircle2 className="h-2.5 w-2.5 text-warning ml-auto" />
                </div>
                <div className="anim-badge flex items-center gap-1 p-1.5 rounded bg-muted" style={{ "--delay": "2.1s" } as React.CSSProperties}>
                  <Star className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[8px] text-muted-foreground">Chapter Master</span>
                </div>
              </div>
            </div>

            {/* Recent Activity - Items slide in */}
            <div className="anim-slide-up bg-card rounded-md border p-2" style={{ "--delay": "1.5s" } as React.CSSProperties}>
              <p className="text-[10px] font-medium mb-2">Recent Activity</p>
              <div className="space-y-1.5">
                <div className="anim-activity flex items-start gap-2" style={{ "--delay": "1.9s" } as React.CSSProperties}>
                  <div className="w-4 h-4 rounded bg-success/10 flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="h-2.5 w-2.5 text-success" />
                  </div>
                  <div>
                    <p className="text-[9px]">Completed: Quadratic Formula Quiz</p>
                    <p className="text-[8px] text-muted-foreground">2 hours ago • Score: 92%</p>
                  </div>
                </div>
                <div className="anim-activity flex items-start gap-2" style={{ "--delay": "2.0s" } as React.CSSProperties}>
                  <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center mt-0.5">
                    <BookOpen className="h-2.5 w-2.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[9px]">Watched: Indices Rules Video</p>
                    <p className="text-[8px] text-muted-foreground">Yesterday • 15 min</p>
                  </div>
                </div>
                <div className="anim-activity flex items-start gap-2" style={{ "--delay": "2.1s" } as React.CSSProperties}>
                  <div className="w-4 h-4 rounded bg-info/10 flex items-center justify-center mt-0.5">
                    <Target className="h-2.5 w-2.5 text-info" />
                  </div>
                  <div>
                    <p className="text-[9px]">Started: Chapter 6 - Graphs</p>
                    <p className="text-[8px] text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Initial states - elements start invisible */
        .parent-preview-container.paused .anim-slide-up,
        .parent-preview-container.paused .anim-badge,
        .parent-preview-container.paused .anim-activity {
          opacity: 0;
        }
        
        .parent-preview-container.paused .anim-progress {
          width: 0;
        }
        
        .parent-preview-container.paused .anim-ring {
          stroke-dashoffset: 75.4;
        }
        
        /* Animations read from --delay variable */
        .parent-preview-container.animate .anim-slide-up {
          animation: parent-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
          transform: translateY(12px);
        }
        
        .parent-preview-container.animate .anim-progress {
          animation: parent-progress-fill 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--delay, 0s);
          width: 0;
        }
        
        .parent-preview-container.animate .anim-ring {
          animation: parent-ring-fill 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--delay, 0s);
          stroke-dashoffset: 75.4;
        }
        
        .parent-preview-container.animate .anim-badge {
          animation: parent-badge-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
          transform: scale(0.8);
        }
        
        .parent-preview-container.animate .anim-activity {
          animation: parent-activity-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
          transform: translateX(-8px);
        }
        
        @keyframes parent-slide-up {
          from { 
            opacity: 0; 
            transform: translateY(12px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes parent-progress-fill {
          from { width: 0; }
          to { width: var(--width, 50%); }
        }
        
        @keyframes parent-ring-fill {
          from { stroke-dashoffset: 75.4; }
          to { stroke-dashoffset: var(--target-offset, 37.7); }
        }
        
        @keyframes parent-badge-pop {
          from { 
            opacity: 0; 
            transform: scale(0.8); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        @keyframes parent-activity-slide {
          from { 
            opacity: 0; 
            transform: translateX(-8px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
      `}</style>
    </div>
  );
}
