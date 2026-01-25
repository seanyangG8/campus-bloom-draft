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
  Trophy,
  Calendar,
  MessageSquare,
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
      {/* Browser Chrome */}
      <div className="absolute inset-3 bg-background rounded-lg shadow-lg border overflow-hidden flex flex-col">
        {/* Status Bar */}
        <div className="h-8 bg-muted/50 border-b flex items-center px-3 gap-2 shrink-0">
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

        {/* Content - Scrollable container */}
        <div className="flex-1 overflow-hidden">
          <div className="anim-content-scroll p-4 space-y-4" style={{ "--scroll-target": "-120px" } as React.CSSProperties}>
            
            {/* Profile Header with Animated Ring */}
            <div className="anim-slide-up flex items-center gap-4 p-3 bg-card rounded-lg border" style={{ "--delay": "0.2s" } as React.CSSProperties}>
              <div className="relative">
                {/* Animated ring around avatar */}
                <svg className="w-14 h-14 -rotate-90">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                  <circle 
                    cx="28" cy="28" r="24" fill="none" 
                    stroke="hsl(var(--primary))" strokeWidth="3"
                    strokeDasharray="150.8"
                    strokeLinecap="round"
                    className="anim-avatar-ring"
                    style={{ "--delay": "0.6s", "--target-offset": "45.2" } as React.CSSProperties}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">SC</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-foreground">Sarah Chen</h2>
                <p className="text-[10px] text-muted-foreground">Secondary 3 • Term 2 Progress</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-warning" />
                    <span className="text-[9px] font-medium">Top 15%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-[9px] text-success">+12% this month</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold anim-count-up" style={{ "--delay": "0.8s" } as React.CSSProperties}>72%</div>
                <p className="text-[9px] text-muted-foreground">Overall Progress</p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-2">
              <div className="anim-slide-up bg-card rounded-lg border p-2.5" style={{ "--delay": "0.4s" } as React.CSSProperties}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[9px] text-muted-foreground">Courses</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold">2</span>
                  <span className="text-[8px] text-muted-foreground">active</span>
                </div>
              </div>
              <div className="anim-slide-up bg-card rounded-lg border p-2.5" style={{ "--delay": "0.5s" } as React.CSSProperties}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Clock className="h-3.5 w-3.5 text-info" />
                  <span className="text-[9px] text-muted-foreground">Hours</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold anim-count-up" style={{ "--delay": "1.0s" } as React.CSSProperties}>48</span>
                  <span className="text-[8px] text-success">+8</span>
                </div>
              </div>
              <div className="anim-slide-up bg-card rounded-lg border p-2.5" style={{ "--delay": "0.6s" } as React.CSSProperties}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Target className="h-3.5 w-3.5 text-success" />
                  <span className="text-[9px] text-muted-foreground">Quizzes</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold">12</span>
                  <span className="text-[8px] text-muted-foreground">passed</span>
                </div>
              </div>
              <div className="anim-slide-up bg-card rounded-lg border p-2.5 relative overflow-hidden" style={{ "--delay": "0.7s" } as React.CSSProperties}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Flame className="h-3.5 w-3.5 text-warning anim-flame" />
                  <span className="text-[9px] text-muted-foreground">Streak</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold anim-count-up" style={{ "--delay": "1.1s" } as React.CSSProperties}>12</span>
                  <span className="text-[8px]">🔥 days</span>
                </div>
              </div>
            </div>

            {/* Course Progress - Full width cards */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium">Course Progress</p>
              
              {/* Math Course */}
              <div className="anim-slide-up bg-card rounded-lg border p-3" style={{ "--delay": "0.9s" } as React.CSSProperties}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-[11px] font-medium">Sec 3 Additional Mathematics</p>
                    <p className="text-[9px] text-muted-foreground">6 of 8 chapters completed • Next: Polynomials</p>
                  </div>
                  <div className="w-12 h-12 relative shrink-0">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                      <circle 
                        cx="24" cy="24" r="20" fill="none" 
                        stroke="hsl(var(--primary))" strokeWidth="3"
                        strokeDasharray="125.7"
                        strokeLinecap="round"
                        className="anim-ring"
                        style={{ "--delay": "1.4s", "--target-offset": "27.6" } as React.CSSProperties}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold">78%</span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="anim-progress h-full bg-primary rounded-full" style={{ "--delay": "1.4s", "--width": "78%" } as React.CSSProperties} />
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-success" />
                    <span className="text-[8px] text-muted-foreground">5 assessments passed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[8px] text-muted-foreground">Next lesson: Tomorrow 3pm</span>
                  </div>
                </div>
              </div>

              {/* Science Course */}
              <div className="anim-slide-up bg-card rounded-lg border p-3" style={{ "--delay": "1.0s" } as React.CSSProperties}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-[11px] font-medium">Pri 6 Science (PSLE Prep)</p>
                    <p className="text-[9px] text-muted-foreground">4 of 10 chapters completed • Next: Electricity</p>
                  </div>
                  <div className="w-12 h-12 relative shrink-0">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                      <circle 
                        cx="24" cy="24" r="20" fill="none" 
                        stroke="hsl(var(--success))" strokeWidth="3"
                        strokeDasharray="125.7"
                        strokeLinecap="round"
                        className="anim-ring"
                        style={{ "--delay": "1.5s", "--target-offset": "69.1" } as React.CSSProperties}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold">45%</span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="anim-progress h-full bg-success rounded-full" style={{ "--delay": "1.5s", "--width": "45%" } as React.CSSProperties} />
                </div>
              </div>
            </div>

            {/* Achievements and Activity Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Achievements */}
              <div className="anim-slide-up bg-card rounded-lg border p-3" style={{ "--delay": "1.2s" } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-medium">Achievements</p>
                  <span className="text-[8px] text-muted-foreground">4 earned</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="anim-badge relative flex items-center gap-1.5 p-2 rounded-lg bg-success/10 overflow-hidden" style={{ "--delay": "1.8s" } as React.CSSProperties}>
                    <Zap className="h-4 w-4 text-success shrink-0" />
                    <div>
                      <span className="text-[9px] font-medium block">Quick Learner</span>
                      <span className="text-[7px] text-muted-foreground">5 lessons in a day</span>
                    </div>
                    <div className="anim-shine" />
                  </div>
                  <div className="anim-badge relative flex items-center gap-1.5 p-2 rounded-lg bg-primary/10 overflow-hidden" style={{ "--delay": "1.9s" } as React.CSSProperties}>
                    <Target className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <span className="text-[9px] font-medium block">Perfect Quiz</span>
                      <span className="text-[7px] text-muted-foreground">100% score</span>
                    </div>
                    <div className="anim-shine" />
                  </div>
                  <div className="anim-badge relative flex items-center gap-1.5 p-2 rounded-lg bg-warning/10 overflow-hidden" style={{ "--delay": "2.0s" } as React.CSSProperties}>
                    <Flame className="h-4 w-4 text-warning shrink-0" />
                    <div>
                      <span className="text-[9px] font-medium block">7-Day Streak</span>
                      <span className="text-[7px] text-muted-foreground">Consistent!</span>
                    </div>
                    <div className="anim-shine" />
                  </div>
                  <div className="anim-badge flex items-center gap-1.5 p-2 rounded-lg bg-muted" style={{ "--delay": "2.1s" } as React.CSSProperties}>
                    <Star className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <span className="text-[9px] font-medium block text-muted-foreground">Chapter Master</span>
                      <span className="text-[7px] text-muted-foreground">2 more to go</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity with Timeline */}
              <div className="anim-slide-up bg-card rounded-lg border p-3" style={{ "--delay": "1.3s" } as React.CSSProperties}>
                <p className="text-[11px] font-medium mb-2">Recent Activity</p>
                <div className="relative">
                  {/* Timeline connector */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-muted anim-timeline" style={{ "--delay": "1.9s" } as React.CSSProperties} />
                  
                  <div className="space-y-2.5">
                    <div className="anim-activity flex items-start gap-2.5 relative" style={{ "--delay": "2.0s" } as React.CSSProperties}>
                      <div className="w-4 h-4 rounded-full bg-success/20 flex items-center justify-center shrink-0 z-10">
                        <CheckCircle2 className="h-2.5 w-2.5 text-success" />
                      </div>
                      <div>
                        <p className="text-[9px] font-medium">Completed: Quadratic Formula Quiz</p>
                        <p className="text-[8px] text-muted-foreground">2 hours ago • Score: 92%</p>
                      </div>
                    </div>
                    <div className="anim-activity flex items-start gap-2.5 relative" style={{ "--delay": "2.1s" } as React.CSSProperties}>
                      <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0 z-10">
                        <BookOpen className="h-2.5 w-2.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[9px] font-medium">Watched: Indices Rules Video</p>
                        <p className="text-[8px] text-muted-foreground">Yesterday • 15 min</p>
                      </div>
                    </div>
                    <div className="anim-activity flex items-start gap-2.5 relative" style={{ "--delay": "2.2s" } as React.CSSProperties}>
                      <div className="w-4 h-4 rounded-full bg-info/20 flex items-center justify-center shrink-0 z-10">
                        <Target className="h-2.5 w-2.5 text-info" />
                      </div>
                      <div>
                        <p className="text-[9px] font-medium">Started: Chapter 6 - Graphs</p>
                        <p className="text-[8px] text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Summary - Revealed by scroll */}
            <div className="anim-slide-up bg-gradient-to-r from-primary/5 to-success/5 rounded-lg border p-3" style={{ "--delay": "1.6s" } as React.CSSProperties}>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="h-4 w-4 text-warning" />
                <p className="text-[11px] font-medium">This Week's Summary</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="anim-summary-item flex items-center gap-2" style={{ "--delay": "2.6s" } as React.CSSProperties}>
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center anim-check-pop">
                    <CheckCircle2 className="h-3 w-3 text-success" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold">5 lessons</span>
                    <p className="text-[8px] text-muted-foreground">completed</p>
                  </div>
                </div>
                <div className="anim-summary-item flex items-center gap-2" style={{ "--delay": "2.8s" } as React.CSSProperties}>
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center anim-check-pop">
                    <Target className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold">2 quizzes</span>
                    <p className="text-[8px] text-muted-foreground">passed</p>
                  </div>
                </div>
                <div className="anim-summary-item flex items-center gap-2" style={{ "--delay": "3.0s" } as React.CSSProperties}>
                  <div className="w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center anim-check-pop">
                    <Star className="h-3 w-3 text-warning" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold">New badge!</span>
                    <p className="text-[8px] text-muted-foreground">earned</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tutor's Note - Revealed by scroll */}
            <div className="anim-slide-up bg-card rounded-lg border p-3" style={{ "--delay": "1.8s" } as React.CSSProperties}>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-[11px] font-medium">Note from Tutor</p>
              </div>
              <div className="anim-note bg-muted/50 rounded-lg p-2.5" style={{ "--delay": "2.8s" } as React.CSSProperties}>
                <p className="text-[9px] italic text-muted-foreground">"Sarah has shown excellent improvement in algebraic expressions. Keep encouraging her practice with word problems!"</p>
                <p className="text-[8px] text-muted-foreground mt-1.5">— Mr. Tan, 2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Initial paused states */
        .parent-preview-container.paused .anim-slide-up,
        .parent-preview-container.paused .anim-badge,
        .parent-preview-container.paused .anim-activity,
        .parent-preview-container.paused .anim-summary-item,
        .parent-preview-container.paused .anim-note {
          opacity: 0;
        }
        
        .parent-preview-container.paused .anim-progress {
          width: 0;
        }
        
        .parent-preview-container.paused .anim-ring,
        .parent-preview-container.paused .anim-avatar-ring {
          stroke-dashoffset: 150.8;
        }
        
        .parent-preview-container.paused .anim-content-scroll {
          transform: translateY(0);
        }
        
        .parent-preview-container.paused .anim-timeline {
          transform: scaleY(0);
          transform-origin: top;
        }
        
        .parent-preview-container.paused .anim-count-up {
          opacity: 0;
        }
        
        /* Animated states */
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
          stroke-dashoffset: 125.7;
          animation: parent-ring-fill 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--delay, 0s);
        }
        
        .parent-preview-container.animate .anim-avatar-ring {
          stroke-dashoffset: 150.8;
          animation: parent-avatar-ring-fill 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--delay, 0s);
        }
        
        .parent-preview-container.animate .anim-badge {
          animation: parent-badge-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
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
        
        .parent-preview-container.animate .anim-summary-item {
          animation: parent-summary-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
          transform: scale(0.9);
        }
        
        .parent-preview-container.animate .anim-note {
          animation: parent-note-fade 0.6s ease-out forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
        }
        
        .parent-preview-container.animate .anim-count-up {
          animation: parent-count-fade 0.6s ease-out forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
          transform: translateY(5px);
        }
        
        .parent-preview-container.animate .anim-content-scroll {
          animation: parent-content-scroll 3.5s ease-in-out forwards;
          animation-delay: 2.2s;
        }
        
        .parent-preview-container.animate .anim-timeline {
          animation: parent-timeline-grow 0.8s ease-out forwards;
          animation-delay: var(--delay, 0s);
          transform: scaleY(0);
          transform-origin: top;
        }
        
        .parent-preview-container.animate .anim-flame {
          animation: parent-flame-flicker 0.8s ease-in-out infinite;
          animation-delay: 1.2s;
        }
        
        .parent-preview-container.animate .anim-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: parent-shine-sweep 0.6s ease-out forwards;
          animation-delay: calc(var(--delay, 0s) + 0.3s);
        }
        
        .parent-preview-container.animate .anim-check-pop {
          animation: parent-check-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: calc(var(--delay, 0s) + 0.2s);
          transform: scale(0);
        }
        
        @keyframes parent-slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes parent-progress-fill {
          from { width: 0; }
          to { width: var(--width, 50%); }
        }
        
        @keyframes parent-ring-fill {
          from { stroke-dashoffset: 125.7; }
          to { stroke-dashoffset: var(--target-offset, 62.85); }
        }
        
        @keyframes parent-avatar-ring-fill {
          from { stroke-dashoffset: 150.8; }
          to { stroke-dashoffset: var(--target-offset, 45.2); }
        }
        
        @keyframes parent-badge-pop {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes parent-activity-slide {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes parent-summary-pop {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes parent-note-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes parent-count-fade {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes parent-content-scroll {
          0%, 30% { transform: translateY(0); }
          55%, 100% { transform: translateY(var(--scroll-target, -100px)); }
        }
        
        @keyframes parent-timeline-grow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        
        @keyframes parent-flame-flicker {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          25% { transform: scale(1.1) rotate(-3deg); opacity: 0.9; }
          50% { transform: scale(0.95) rotate(2deg); opacity: 1; }
          75% { transform: scale(1.05) rotate(-2deg); opacity: 0.85; }
        }
        
        @keyframes parent-shine-sweep {
          from { left: -100%; }
          to { left: 100%; }
        }
        
        @keyframes parent-check-pop {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
