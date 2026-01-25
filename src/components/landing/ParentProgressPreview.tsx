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

  return (
    <div 
      ref={containerRef}
      className={`parent-preview-container relative w-full h-full bg-gradient-to-br from-muted/30 to-muted/50 overflow-hidden ${isAnimating ? 'animate' : 'paused'}`}
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

          {/* Stats Row - Individual cards animate */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="anim-stat-card bg-card rounded-md border p-2">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Overall</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-semibold">72%</span>
                <span className="text-[8px] text-success">+5%</span>
              </div>
            </div>
            <div className="anim-stat-card bg-card rounded-md border p-2">
              <div className="flex items-center gap-1 mb-1">
                <BookOpen className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Courses</span>
              </div>
              <span className="text-base font-semibold">2</span>
            </div>
            <div className="anim-stat-card bg-card rounded-md border p-2">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Hours</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-semibold">48</span>
                <span className="text-[8px] text-success">+8</span>
              </div>
            </div>
            <div className="anim-stat-card bg-card rounded-md border p-2">
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
            <div className="anim-course-card bg-card rounded-md border p-2">
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
                      className="anim-ring-1"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-semibold">78%</span>
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="anim-progress-1 h-full bg-primary rounded-full" />
              </div>
            </div>
            <div className="anim-course-card bg-card rounded-md border p-2">
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
                      className="anim-ring-2"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-semibold">45%</span>
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="anim-progress-2 h-full bg-success rounded-full" />
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Achievements - Badges pop in */}
            <div className="anim-bottom-card bg-card rounded-md border p-2">
              <p className="text-[10px] font-medium mb-2">Achievements</p>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="anim-badge flex items-center gap-1 p-1.5 rounded bg-success/10">
                  <Zap className="h-3 w-3 text-success" />
                  <span className="text-[8px]">Quick Learner</span>
                  <CheckCircle2 className="h-2.5 w-2.5 text-success ml-auto" />
                </div>
                <div className="anim-badge flex items-center gap-1 p-1.5 rounded bg-primary/10">
                  <Target className="h-3 w-3 text-primary" />
                  <span className="text-[8px]">Perfect Quiz</span>
                  <CheckCircle2 className="h-2.5 w-2.5 text-primary ml-auto" />
                </div>
                <div className="anim-badge flex items-center gap-1 p-1.5 rounded bg-warning/10">
                  <Flame className="h-3 w-3 text-warning" />
                  <span className="text-[8px]">7-Day Streak</span>
                  <CheckCircle2 className="h-2.5 w-2.5 text-warning ml-auto" />
                </div>
                <div className="anim-badge flex items-center gap-1 p-1.5 rounded bg-muted">
                  <Star className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[8px] text-muted-foreground">Chapter Master</span>
                </div>
              </div>
            </div>

            {/* Recent Activity - Items slide in */}
            <div className="anim-bottom-card bg-card rounded-md border p-2">
              <p className="text-[10px] font-medium mb-2">Recent Activity</p>
              <div className="space-y-1.5">
                <div className="anim-activity flex items-start gap-2">
                  <div className="w-4 h-4 rounded bg-success/10 flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="h-2.5 w-2.5 text-success" />
                  </div>
                  <div>
                    <p className="text-[9px]">Completed: Quadratic Formula Quiz</p>
                    <p className="text-[8px] text-muted-foreground">2 hours ago • Score: 92%</p>
                  </div>
                </div>
                <div className="anim-activity flex items-start gap-2">
                  <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center mt-0.5">
                    <BookOpen className="h-2.5 w-2.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[9px]">Watched: Indices Rules Video</p>
                    <p className="text-[8px] text-muted-foreground">Yesterday • 15 min</p>
                  </div>
                </div>
                <div className="anim-activity flex items-start gap-2">
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
        /* Initial states - individual elements animate, not sections */
        .parent-preview-container.paused .anim-stat-card {
          opacity: 0;
          transform: translateY(12px);
        }
        
        .parent-preview-container.paused .anim-course-card {
          opacity: 0;
          transform: translateY(12px);
        }
        
        .parent-preview-container.paused .anim-bottom-card {
          opacity: 0;
          transform: translateY(12px);
        }
        
        .parent-preview-container.paused .anim-badge {
          opacity: 0;
          transform: scale(0.8);
        }
        
        .parent-preview-container.paused .anim-activity {
          opacity: 0;
          transform: translateX(-8px);
        }
        
        /* Progress bars and rings start empty */
        .parent-preview-container.paused .anim-progress-1,
        .parent-preview-container.paused .anim-progress-2 {
          width: 0%;
        }
        
        .parent-preview-container.paused .anim-ring-1,
        .parent-preview-container.paused .anim-ring-2 {
          stroke-dashoffset: 75.4;
        }
        
        /* Stat cards slide up with stagger */
        .parent-preview-container.animate .anim-stat-card:nth-child(1) {
          animation: parent-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
        }
        .parent-preview-container.animate .anim-stat-card:nth-child(2) {
          animation: parent-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
        }
        .parent-preview-container.animate .anim-stat-card:nth-child(3) {
          animation: parent-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
        }
        .parent-preview-container.animate .anim-stat-card:nth-child(4) {
          animation: parent-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
        }
        
        /* Course cards slide up */
        .parent-preview-container.animate .anim-course-card:nth-child(1) {
          animation: parent-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards;
        }
        .parent-preview-container.animate .anim-course-card:nth-child(2) {
          animation: parent-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;
        }
        
        /* Hero moment: Progress bars fill */
        .parent-preview-container.animate .anim-progress-1 {
          animation: parent-progress-78 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s forwards;
        }
        .parent-preview-container.animate .anim-progress-2 {
          animation: parent-progress-45 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards;
        }
        
        /* Hero moment: Progress rings draw */
        .parent-preview-container.animate .anim-ring-1 {
          animation: parent-ring-78 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s forwards;
        }
        .parent-preview-container.animate .anim-ring-2 {
          animation: parent-ring-45 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards;
        }
        
        /* Bottom cards slide up */
        .parent-preview-container.animate .anim-bottom-card:nth-child(1) {
          animation: parent-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 1.5s forwards;
        }
        .parent-preview-container.animate .anim-bottom-card:nth-child(2) {
          animation: parent-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 1.6s forwards;
        }
        
        /* Badges pop in with stagger */
        .parent-preview-container.animate .anim-badge:nth-child(1) {
          animation: parent-badge-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) 1.9s forwards;
        }
        .parent-preview-container.animate .anim-badge:nth-child(2) {
          animation: parent-badge-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) 2.0s forwards;
        }
        .parent-preview-container.animate .anim-badge:nth-child(3) {
          animation: parent-badge-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) 2.1s forwards;
        }
        .parent-preview-container.animate .anim-badge:nth-child(4) {
          animation: parent-badge-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) 2.2s forwards;
        }
        
        /* Activity items slide in */
        .parent-preview-container.animate .anim-activity:nth-child(1) {
          animation: parent-activity-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1) 2.0s forwards;
        }
        .parent-preview-container.animate .anim-activity:nth-child(2) {
          animation: parent-activity-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1) 2.1s forwards;
        }
        .parent-preview-container.animate .anim-activity:nth-child(3) {
          animation: parent-activity-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1) 2.2s forwards;
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
        
        @keyframes parent-progress-78 {
          from { width: 0%; }
          to { width: 78%; }
        }
        
        @keyframes parent-progress-45 {
          from { width: 0%; }
          to { width: 45%; }
        }
        
        @keyframes parent-ring-78 {
          from { stroke-dashoffset: 75.4; }
          to { stroke-dashoffset: 16.6; }
        }
        
        @keyframes parent-ring-45 {
          from { stroke-dashoffset: 75.4; }
          to { stroke-dashoffset: 41.5; }
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
