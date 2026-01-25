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
      {/* Browser Chrome */}
      <div className="absolute inset-3 bg-background rounded-lg shadow-lg border overflow-hidden flex flex-col anim-fade-in">
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
        <div className="flex-1 p-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 anim-header">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">SC</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Sarah's Progress</h2>
              <p className="text-[10px] text-muted-foreground">Secondary 3 • This semester</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-card rounded-md border p-2 anim-stat-1">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Overall</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold anim-value">72%</span>
                <span className="text-[8px] text-success anim-badge-pop">+5%</span>
              </div>
            </div>
            <div className="bg-card rounded-md border p-2 anim-stat-2">
              <div className="flex items-center gap-1 mb-1">
                <BookOpen className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Courses</span>
              </div>
              <span className="text-lg font-semibold anim-value">2</span>
            </div>
            <div className="bg-card rounded-md border p-2 anim-stat-3">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Hours</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold anim-value">48</span>
                <span className="text-[8px] text-success anim-badge-pop">+8</span>
              </div>
            </div>
            <div className="bg-card rounded-md border p-2 anim-stat-4">
              <div className="flex items-center gap-1 mb-1">
                <Flame className="h-3 w-3 text-warning" />
                <span className="text-[9px] text-muted-foreground">Streak</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold anim-value">12</span>
                <span className="text-[8px]">🔥</span>
              </div>
            </div>
          </div>

          {/* Course Progress Card */}
          <div className="bg-card rounded-md border p-3 mb-4 anim-course-card">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-[10px] font-medium">Secondary 3 Mathematics</p>
                <p className="text-[8px] text-muted-foreground">6 of 8 chapters completed</p>
              </div>
              <div className="w-10 h-10 relative anim-ring">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                  <circle 
                    cx="20" cy="20" r="16" fill="none" 
                    stroke="hsl(var(--primary))" strokeWidth="3"
                    strokeDasharray="100" 
                    strokeDashoffset="22"
                    className="anim-ring-fill"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-semibold">78%</span>
              </div>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full anim-progress-bar" style={{ width: '0%' }} />
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Achievements */}
            <div className="bg-card rounded-md border p-2 anim-achievements">
              <p className="text-[10px] font-medium mb-2">Achievements</p>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="flex items-center gap-1 p-1.5 rounded bg-success/10 anim-badge-1">
                  <Zap className="h-3 w-3 text-success" />
                  <span className="text-[8px]">Quick Learner</span>
                  <CheckCircle2 className="h-2.5 w-2.5 text-success ml-auto anim-check" />
                </div>
                <div className="flex items-center gap-1 p-1.5 rounded bg-primary/10 anim-badge-2">
                  <Target className="h-3 w-3 text-primary" />
                  <span className="text-[8px]">Perfect Quiz</span>
                  <CheckCircle2 className="h-2.5 w-2.5 text-primary ml-auto anim-check" />
                </div>
                <div className="flex items-center gap-1 p-1.5 rounded bg-warning/10 anim-badge-3">
                  <Flame className="h-3 w-3 text-warning" />
                  <span className="text-[8px]">7-Day Streak</span>
                  <CheckCircle2 className="h-2.5 w-2.5 text-warning ml-auto anim-check" />
                </div>
                <div className="flex items-center gap-1 p-1.5 rounded bg-muted anim-badge-4">
                  <Star className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[8px] text-muted-foreground">Chapter Master</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card rounded-md border p-2 anim-activity">
              <p className="text-[10px] font-medium mb-2">Recent Activity</p>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2 anim-activity-1">
                  <div className="w-1 h-1 rounded-full bg-success mt-1.5" />
                  <div>
                    <p className="text-[9px]">Completed: Quadratic Formula Quiz</p>
                    <p className="text-[8px] text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 anim-activity-2">
                  <div className="w-1 h-1 rounded-full bg-primary mt-1.5" />
                  <div>
                    <p className="text-[9px]">Watched: Indices Rules Video</p>
                    <p className="text-[8px] text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 anim-activity-3">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5" />
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
        .parent-preview-container.paused * {
          animation-play-state: paused !important;
          opacity: 0;
        }
        .parent-preview-container.paused .anim-fade-in {
          opacity: 1;
        }
        
        .parent-preview-container.animate .anim-fade-in {
          animation: parent-fade-in 0.4s ease-out forwards;
        }
        .parent-preview-container.animate .anim-header {
          animation: parent-slide-down 0.4s ease-out 0.3s forwards;
        }
        
        .parent-preview-container.animate .anim-stat-1 {
          animation: parent-slide-up 0.3s ease-out 0.5s forwards;
        }
        .parent-preview-container.animate .anim-stat-2 {
          animation: parent-slide-up 0.3s ease-out 0.65s forwards;
        }
        .parent-preview-container.animate .anim-stat-3 {
          animation: parent-slide-up 0.3s ease-out 0.8s forwards;
        }
        .parent-preview-container.animate .anim-stat-4 {
          animation: parent-slide-up 0.3s ease-out 0.95s forwards;
        }
        
        .parent-preview-container.animate .anim-value {
          animation: parent-fade-in 0.3s ease-out 1.2s forwards;
        }
        .parent-preview-container.animate .anim-badge-pop {
          animation: parent-pop 0.3s ease-out 1.4s forwards;
        }
        
        .parent-preview-container.animate .anim-course-card {
          animation: parent-slide-up 0.3s ease-out 1.6s forwards;
        }
        .parent-preview-container.animate .anim-progress-bar {
          animation: parent-progress-fill 0.8s ease-out 2s forwards;
        }
        .parent-preview-container.animate .anim-ring {
          animation: parent-fade-in 0.3s ease-out 2s forwards;
        }
        .parent-preview-container.animate .anim-ring-fill {
          animation: parent-ring-fill 0.8s ease-out 2.2s forwards;
        }
        
        .parent-preview-container.animate .anim-achievements {
          animation: parent-slide-up 0.3s ease-out 2.8s forwards;
        }
        .parent-preview-container.animate .anim-badge-1 {
          animation: parent-fade-in 0.2s ease-out 3.2s forwards;
        }
        .parent-preview-container.animate .anim-badge-2 {
          animation: parent-fade-in 0.2s ease-out 3.4s forwards;
        }
        .parent-preview-container.animate .anim-badge-3 {
          animation: parent-fade-in 0.2s ease-out 3.6s forwards;
        }
        .parent-preview-container.animate .anim-badge-4 {
          animation: parent-fade-in 0.2s ease-out 3.8s forwards;
        }
        .parent-preview-container.animate .anim-check {
          animation: parent-pop 0.2s ease-out 4s forwards;
        }
        
        .parent-preview-container.animate .anim-activity {
          animation: parent-slide-up 0.3s ease-out 2.8s forwards;
        }
        .parent-preview-container.animate .anim-activity-1 {
          animation: parent-slide-left 0.2s ease-out 3.2s forwards;
        }
        .parent-preview-container.animate .anim-activity-2 {
          animation: parent-slide-left 0.2s ease-out 3.5s forwards;
        }
        .parent-preview-container.animate .anim-activity-3 {
          animation: parent-slide-left 0.2s ease-out 3.8s forwards;
        }
        
        @keyframes parent-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes parent-slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes parent-slide-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes parent-slide-left {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes parent-pop {
          0% { opacity: 0; transform: scale(0.5); }
          70% { transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes parent-progress-fill {
          from { width: 0%; }
          to { width: 78%; }
        }
        
        @keyframes parent-ring-fill {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 22; }
        }
      `}</style>
    </div>
  );
}
