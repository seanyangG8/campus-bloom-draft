import { useEffect, useRef, useState } from "react";
import { 
  Users, 
  DollarSign, 
  BookOpen, 
  Calendar,
  AlertTriangle,
  TrendingUp,
  Clock,
  FileText,
  Bell,
  ChevronRight,
} from "lucide-react";

type PreviewProps = {
  play?: boolean;
  restartKey?: number;
  onAnimationComplete?: () => void;
  prefersReducedMotion?: boolean;
};

const ADMIN_ANIMATION_MS = 6000;
const ADMIN_ANIMATION_MS_REDUCED = 1200;

export function AdminDashboardPreview({
  play,
  restartKey = 0,
  onAnimationComplete,
  prefersReducedMotion = false,
}: PreviewProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isControlled = play !== undefined;

  useEffect(() => {
    setIsAnimating(false);
    setHasAnimated(false);
  }, [restartKey]);

  useEffect(() => {
    if (isControlled) {
      if (play) {
        setIsAnimating(true);
        setHasAnimated(true);
      } else {
        setIsAnimating(false);
      }
      return;
    }

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
  }, [hasAnimated, isControlled, play]);

  useEffect(() => {
    if (!onAnimationComplete || !isAnimating) return;
    const duration = prefersReducedMotion ? ADMIN_ANIMATION_MS_REDUCED : ADMIN_ANIMATION_MS;
    const id = window.setTimeout(() => onAnimationComplete(), duration);
    return () => window.clearTimeout(id);
  }, [isAnimating, onAnimationComplete, restartKey, prefersReducedMotion]);

  const animationClass = isAnimating ? "animate" : "paused";

  return (
    <div 
      ref={containerRef}
      className={`admin-preview-container relative w-full min-h-[520px] sm:min-h-[560px] bg-gradient-to-br from-muted/30 to-muted/50 overflow-visible ${animationClass}`}
    >
      {/* Browser Chrome */}
      <div className="absolute inset-3 bg-background rounded-lg shadow-lg border overflow-hidden flex flex-col">
        {/* Status Bar */}
        <div className="h-8 bg-muted/50 border-b flex items-center px-3 gap-2 shrink-0">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
          </div>
          <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="bg-background/80 rounded px-3 py-0.5 text-[10px] text-muted-foreground truncate">
                app.learncampus.com/admin/dashboard
              </div>
            </div>
            <div className="text-[11px] font-medium text-foreground/80 truncate text-right min-w-[110px]">
              Centre Command
            </div>
          </div>
        </div>

        {/* Dashboard Content - Scrollable container */}
        <div className="flex-1 overflow-hidden">
          <div className="anim-content-scroll p-4 space-y-4" style={{ "--scroll-target": "-140px" } as React.CSSProperties}>
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-3">
              {/* Revenue Stat with Mini Chart */}
              <div className="anim-slide-up bg-card rounded-lg border p-3" style={{ "--delay": "0.2s" } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded bg-success/10">
                    <DollarSign className="h-3.5 w-3.5 text-success" />
                  </div>
                  <span className="text-[8px] text-success font-medium">+12%</span>
                </div>
                <div className="anim-count-up text-lg font-semibold" style={{ "--delay": "0.8s" } as React.CSSProperties}>$24,580</div>
                <p className="text-[9px] text-muted-foreground">This month</p>
                {/* Mini revenue chart */}
                <div className="mt-2 h-8">
                  <svg className="w-full h-full" viewBox="0 0 100 30">
                    <path 
                      d="M0,25 L15,20 L30,22 L45,15 L60,18 L75,10 L90,12 L100,5" 
                      fill="none" 
                      stroke="hsl(var(--success))" 
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="anim-chart-draw"
                      style={{ "--delay": "1.0s" } as React.CSSProperties}
                    />
                    <path 
                      d="M0,25 L15,20 L30,22 L45,15 L60,18 L75,10 L90,12 L100,5 L100,30 L0,30 Z" 
                      fill="url(#revenueGradient)" 
                      className="anim-chart-fill"
                      style={{ "--delay": "1.2s" } as React.CSSProperties}
                    />
                    <defs>
                      <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Students Stat */}
              <div className="anim-slide-up bg-card rounded-lg border p-3" style={{ "--delay": "0.3s" } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded bg-primary/10">
                    <Users className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-[8px] text-success font-medium">+3</span>
                </div>
                <div className="anim-count-up text-lg font-semibold" style={{ "--delay": "0.9s" } as React.CSSProperties}>156</div>
                <p className="text-[9px] text-muted-foreground">Active students</p>
                <div className="mt-2 flex -space-x-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="anim-avatar-pop w-5 h-5 rounded-full bg-muted border-2 border-background flex items-center justify-center" style={{ "--delay": `${1.4 + i * 0.1}s` } as React.CSSProperties}>
                      <span className="text-[7px] font-medium">{['JL', 'KS', 'AM', 'RL', '+8'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courses Stat */}
              <div className="anim-slide-up bg-card rounded-lg border p-3" style={{ "--delay": "0.4s" } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded bg-info/10">
                    <BookOpen className="h-3.5 w-3.5 text-info" />
                  </div>
                </div>
                <div className="anim-count-up text-lg font-semibold" style={{ "--delay": "1.0s" } as React.CSSProperties}>12</div>
                <p className="text-[9px] text-muted-foreground">Active courses</p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                      <div className="anim-progress h-full bg-info rounded-full" style={{ "--delay": "1.6s", "--width": "75%" } as React.CSSProperties} />
                    </div>
                    <span className="text-[7px] text-muted-foreground">Math</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                      <div className="anim-progress h-full bg-success rounded-full" style={{ "--delay": "1.7s", "--width": "60%" } as React.CSSProperties} />
                    </div>
                    <span className="text-[7px] text-muted-foreground">Sci</span>
                  </div>
                </div>
              </div>

              {/* Sessions Stat */}
              <div className="anim-slide-up bg-card rounded-lg border p-3" style={{ "--delay": "0.5s" } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded bg-warning/10">
                    <Calendar className="h-3.5 w-3.5 text-warning" />
                  </div>
                </div>
                <div className="anim-count-up text-lg font-semibold" style={{ "--delay": "1.1s" } as React.CSSProperties}>8</div>
                <p className="text-[9px] text-muted-foreground">Today's sessions</p>
                <div className="mt-2 space-y-0.5">
                  <div className="anim-session-item flex items-center gap-1" style={{ "--delay": "1.8s" } as React.CSSProperties}>
                    <div className="w-1 h-1 rounded-full bg-success" />
                    <span className="text-[7px]">2 completed</span>
                  </div>
                  <div className="anim-session-item flex items-center gap-1" style={{ "--delay": "1.9s" } as React.CSSProperties}>
                    <div className="w-1 h-1 rounded-full bg-warning anim-pulse-dot" />
                    <span className="text-[7px]">1 in progress</span>
                  </div>
                  <div className="anim-session-item flex items-center gap-1" style={{ "--delay": "2.0s" } as React.CSSProperties}>
                    <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span className="text-[7px]">5 upcoming</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Row - 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              {/* At-Risk Students */}
              <div className="anim-slide-up bg-card rounded-lg border p-3" style={{ "--delay": "0.7s" } as React.CSSProperties}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded bg-destructive/10 anim-alert-pulse">
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium">Needs Attention</p>
                    <p className="text-[8px] text-muted-foreground">3 students at risk</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "James L.", course: "Sec 3 A-Math", progress: 32, trend: -8 },
                    { name: "Sarah K.", course: "Sec 2 Science", progress: 45, trend: -5 },
                    { name: "Michael T.", course: "Pri 6 Math", progress: 38, trend: -12 },
                  ].map((student, i) => (
                    <div key={i} className="anim-risk-item flex items-center gap-2" style={{ "--delay": `${1.2 + i * 0.15}s` } as React.CSSProperties}>
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <span className="text-[8px] font-medium">{student.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-medium truncate">{student.name}</p>
                        <p className="text-[7px] text-muted-foreground truncate">{student.course}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1">
                          <div className="w-10 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="anim-progress h-full bg-destructive/70 rounded-full" style={{ "--delay": `${1.5 + i * 0.15}s`, "--width": `${student.progress}%` } as React.CSSProperties} />
                          </div>
                          <span className="text-[8px] font-medium">{student.progress}%</span>
                        </div>
                        <span className="text-[7px] text-destructive">{student.trend}% this week</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Schedule */}
              <div className="anim-slide-up bg-card rounded-lg border p-3" style={{ "--delay": "0.8s" } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-primary/10">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p className="text-[10px] font-medium">Today's Schedule</p>
                  </div>
                  <span className="text-[8px] text-muted-foreground">3 sessions</span>
                </div>
                <div className="space-y-2">
                  {[
                    { time: "10:00 AM", name: "Sec 3 Math", tutor: "Mr. Tan", status: "completed" },
                    { time: "2:00 PM", name: "Pri 6 Science", tutor: "Ms. Lee", status: "live" },
                    { time: "4:30 PM", name: "Sec 2 English", tutor: "Mr. Lim", status: "upcoming" },
                  ].map((session, i) => (
                    <div key={i} className="anim-schedule-item flex items-center gap-2 p-1.5 rounded bg-muted/50" style={{ "--delay": `${1.3 + i * 0.15}s` } as React.CSSProperties}>
                      <div className="w-12 text-[8px] font-medium text-muted-foreground shrink-0">{session.time}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-medium truncate">{session.name}</p>
                        <p className="text-[7px] text-muted-foreground">{session.tutor}</p>
                      </div>
                      <div className={`shrink-0 px-1.5 py-0.5 rounded text-[7px] font-medium ${
                        session.status === 'completed' ? 'bg-success/10 text-success' :
                        session.status === 'live' ? 'bg-destructive/10 text-destructive anim-live-pulse' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {session.status === 'live' ? '● LIVE' : session.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Overview */}
            <div className="anim-slide-up" style={{ "--delay": "1.0s" } as React.CSSProperties}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-medium">Course Overview</p>
                <span className="text-[8px] text-primary cursor-pointer">View all →</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: "Sec 3 A-Math", students: 24, progress: 72, color: "primary" },
                  { name: "Pri 6 Science", students: 18, progress: 58, color: "success" },
                  { name: "Sec 2 English", students: 20, progress: 85, color: "info" },
                ].map((course, i) => (
                  <div key={i} className="anim-course-card bg-card rounded-lg border p-2.5" style={{ "--delay": `${1.4 + i * 0.1}s` } as React.CSSProperties}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[9px] font-medium">{course.name}</p>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <Users className="h-2.5 w-2.5 text-muted-foreground" />
                      <span className="text-[8px] text-muted-foreground">{course.students} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`anim-progress h-full rounded-full ${
                            course.color === 'primary' ? 'bg-primary' :
                            course.color === 'success' ? 'bg-success' : 'bg-info'
                          }`} 
                          style={{ "--delay": `${1.8 + i * 0.1}s`, "--width": `${course.progress}%` } as React.CSSProperties} 
                        />
                      </div>
                      <span className="text-[8px] font-medium">{course.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements - Revealed by scroll */}
            <div className="anim-slide-up" style={{ "--delay": "1.6s" } as React.CSSProperties}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-[11px] font-medium">Recent Announcements</p>
                </div>
                <span className="text-[8px] text-primary cursor-pointer">+ New</span>
              </div>
              <div className="space-y-2">
                {[
                  { title: "Holiday Schedule Update", time: "2 hours ago", urgent: true },
                  { title: "New Assessment Templates Available", time: "Yesterday", urgent: false },
                ].map((item, i) => (
                  <div key={i} className="anim-announcement flex items-center gap-2 p-2 rounded-lg bg-card border" style={{ "--delay": `${2.2 + i * 0.15}s` } as React.CSSProperties}>
                    {item.urgent && <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-medium truncate">{item.title}</p>
                      <p className="text-[7px] text-muted-foreground">{item.time}</p>
                    </div>
                    <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Invoices - Revealed by scroll */}
            <div className="anim-slide-up" style={{ "--delay": "1.8s" } as React.CSSProperties}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-[11px] font-medium">Pending Invoices</p>
                </div>
                <div className="anim-button-highlight px-2 py-1 rounded bg-primary text-primary-foreground text-[8px] font-medium" style={{ "--delay": "2.8s" } as React.CSSProperties}>
                  Generate Invoices
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="anim-invoice-card p-2 rounded-lg bg-card border" style={{ "--delay": "2.4s" } as React.CSSProperties}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-medium">Overdue</span>
                    <span className="text-[8px] text-destructive font-medium">$3,240</span>
                  </div>
                  <p className="text-[7px] text-muted-foreground">8 invoices</p>
                </div>
                <div className="anim-invoice-card p-2 rounded-lg bg-card border" style={{ "--delay": "2.5s" } as React.CSSProperties}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-medium">This Week</span>
                    <span className="text-[8px] text-warning font-medium">$5,680</span>
                  </div>
                  <p className="text-[7px] text-muted-foreground">12 invoices</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Initial paused states */
        .admin-preview-container.paused .anim-slide-up,
        .admin-preview-container.paused .anim-risk-item,
        .admin-preview-container.paused .anim-schedule-item,
        .admin-preview-container.paused .anim-course-card,
        .admin-preview-container.paused .anim-avatar-pop,
        .admin-preview-container.paused .anim-session-item,
        .admin-preview-container.paused .anim-announcement,
        .admin-preview-container.paused .anim-invoice-card {
          opacity: 0;
        }
        
        .admin-preview-container.paused .anim-progress {
          width: 0;
        }
        
        .admin-preview-container.paused .anim-chart-draw {
          stroke-dashoffset: 150;
        }
        
        .admin-preview-container.paused .anim-chart-fill {
          opacity: 0;
        }
        
        .admin-preview-container.paused .anim-content-scroll {
          transform: translateY(0);
        }
        
        /* Animated states */
        .admin-preview-container.animate .anim-slide-up {
          animation: admin-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
          transform: translateY(12px);
        }
        
        .admin-preview-container.animate .anim-risk-item,
        .admin-preview-container.animate .anim-schedule-item,
        .admin-preview-container.animate .anim-session-item {
          animation: admin-fade-slide 0.4s ease-out forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
          transform: translateX(-8px);
        }
        
        .admin-preview-container.animate .anim-course-card,
        .admin-preview-container.animate .anim-announcement,
        .admin-preview-container.animate .anim-invoice-card {
          animation: admin-scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
          transform: scale(0.95);
        }
        
        .admin-preview-container.animate .anim-avatar-pop {
          animation: admin-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
          transform: scale(0);
        }
        
        .admin-preview-container.animate .anim-progress {
          animation: admin-progress-fill 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--delay, 0s);
          width: 0;
        }
        
        .admin-preview-container.animate .anim-chart-draw {
          stroke-dasharray: 150;
          stroke-dashoffset: 150;
          animation: admin-chart-draw 1.2s ease-out forwards;
          animation-delay: var(--delay, 0s);
        }
        
        .admin-preview-container.animate .anim-chart-fill {
          animation: admin-chart-fill 0.6s ease-out forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
        }
        
        .admin-preview-container.animate .anim-count-up {
          animation: admin-count-fade 0.6s ease-out forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
          transform: translateY(5px);
        }
        
        .admin-preview-container.animate .anim-content-scroll {
          animation: admin-content-scroll 3s ease-in-out forwards;
          animation-delay: 2.0s;
        }
        
        .admin-preview-container.animate .anim-alert-pulse {
          animation: admin-alert-pulse 2s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        
        .admin-preview-container.animate .anim-live-pulse {
          animation: admin-live-pulse 1.5s ease-in-out infinite;
          animation-delay: 1.8s;
        }
        
        .admin-preview-container.animate .anim-pulse-dot {
          animation: admin-dot-pulse 1s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .admin-preview-container.animate .anim-button-highlight {
          animation: admin-button-glow 0.8s ease-out forwards, admin-button-pulse 2s ease-in-out infinite 3.5s;
          animation-delay: var(--delay, 0s);
        }
        
        @keyframes admin-slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes admin-fade-slide {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes admin-scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes admin-pop {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes admin-progress-fill {
          from { width: 0; }
          to { width: var(--width, 50%); }
        }
        
        @keyframes admin-chart-draw {
          from { stroke-dashoffset: 150; }
          to { stroke-dashoffset: 0; }
        }
        
        @keyframes admin-chart-fill {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes admin-count-fade {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes admin-content-scroll {
          0%, 25% { transform: translateY(0); }
          50%, 100% { transform: translateY(var(--scroll-target, -100px)); }
        }
        
        @keyframes admin-alert-pulse {
          0%, 100% { box-shadow: 0 0 0 0 hsl(var(--destructive) / 0); }
          50% { box-shadow: 0 0 0 4px hsl(var(--destructive) / 0.15); }
        }
        
        @keyframes admin-live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes admin-dot-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.7; }
        }
        
        @keyframes admin-button-glow {
          0% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0); }
          50% { box-shadow: 0 0 0 6px hsl(var(--primary) / 0.3); }
          100% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0); }
        }
        
        @keyframes admin-button-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}
