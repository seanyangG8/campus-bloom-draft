import { useEffect, useRef, useState } from "react";
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  AlertTriangle,
  Video,
  FileText,
  BookOpen,
} from "lucide-react";

export function AdminDashboardPreview() {
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
      className={`admin-preview-container relative w-full h-full bg-gradient-to-br from-muted/30 to-muted/50 overflow-hidden ${isAnimating ? 'animate' : 'paused'}`}
    >
      {/* Browser Chrome */}
      <div className="absolute inset-3 bg-background rounded-lg shadow-lg border overflow-hidden flex flex-col anim-chrome">
        {/* Status Bar */}
        <div className="h-8 bg-muted/50 border-b flex items-center px-3 gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-background/80 rounded px-3 py-0.5 text-[10px] text-muted-foreground">
              app.learncampus.com/admin/dashboard
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-3 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 anim-section-header">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Dashboard</h2>
              <p className="text-[10px] text-muted-foreground">Welcome back, Admin</p>
            </div>
            <div className="flex gap-1.5">
              <div className="px-2 py-1 bg-primary text-primary-foreground rounded text-[9px] font-medium">
                Generate Invoices
              </div>
            </div>
          </div>

          {/* Stats Grid - All 4 cards animate together */}
          <div className="grid grid-cols-4 gap-2 mb-3 anim-section-stats">
            <div className="bg-card rounded-md border p-2">
              <div className="flex items-center gap-1.5 mb-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Students</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-semibold">48</span>
                <span className="text-[8px] text-success">+12%</span>
              </div>
            </div>
            <div className="bg-card rounded-md border p-2">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Completion</span>
              </div>
              <span className="text-base font-semibold">67%</span>
            </div>
            <div className="bg-card rounded-md border p-2">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Sessions</span>
              </div>
              <span className="text-base font-semibold">6</span>
            </div>
            <div className="bg-card rounded-md border p-2">
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Revenue</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-semibold">$12.4k</span>
                <span className="text-[8px] text-success">+8%</span>
              </div>
            </div>
          </div>

          {/* Middle Row - Animate together */}
          <div className="grid grid-cols-3 gap-2 mb-3 anim-section-middle">
            {/* At-Risk Students */}
            <div className="bg-card rounded-md border p-2">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="h-3 w-3 text-warning" />
                <span className="text-[10px] font-medium">At-Risk</span>
                <span className="ml-auto text-[8px] bg-warning/20 text-warning px-1 rounded">2</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[8px]">SC</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] truncate">Sarah Chen</p>
                    <div className="h-1 bg-muted rounded-full w-full">
                      <div className="h-full bg-warning rounded-full" style={{ width: '32%' }} />
                    </div>
                  </div>
                  <span className="text-[8px] text-warning">32%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[8px]">ML</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] truncate">Marcus Lee</p>
                    <div className="h-1 bg-muted rounded-full w-full">
                      <div className="h-full bg-destructive rounded-full" style={{ width: '28%' }} />
                    </div>
                  </div>
                  <span className="text-[8px] text-destructive">28%</span>
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-card rounded-md border p-2">
              <div className="flex items-center gap-1.5 mb-2">
                <Video className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-medium">Sessions</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-success" />
                  <span className="text-[9px] flex-1">Algebra Review</span>
                  <span className="text-[8px] text-muted-foreground">3pm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  <span className="text-[9px] flex-1">Physics Lab</span>
                  <span className="text-[8px] text-muted-foreground">Tmrw</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span className="text-[9px] flex-1">Chemistry</span>
                  <span className="text-[8px] text-muted-foreground">Wed</span>
                </div>
              </div>
            </div>

            {/* Invoices */}
            <div className="bg-card rounded-md border p-2">
              <div className="flex items-center gap-1.5 mb-2">
                <FileText className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-medium">Invoices</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-muted-foreground">Overdue</span>
                  <span className="text-[9px] text-destructive font-medium">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-muted-foreground">Pending</span>
                  <span className="text-[9px] text-warning font-medium">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-muted-foreground">Paid</span>
                  <span className="text-[9px] text-success font-medium">12</span>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Overview - Animate together */}
          <div className="anim-section-courses">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium">Courses Overview</span>
              <span className="text-[8px] text-primary">View All</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-card rounded-md border p-2">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-2.5 w-2.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] font-medium truncate">Sec 3 Math</p>
                    <p className="text-[7px] text-muted-foreground">12 students</p>
                  </div>
                </div>
                <div className="h-1 bg-muted rounded-full">
                  <div className="h-full bg-primary rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
              <div className="bg-card rounded-md border p-2">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded bg-success/10 flex items-center justify-center">
                    <BookOpen className="h-2.5 w-2.5 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] font-medium truncate">Pri 6 Science</p>
                    <p className="text-[7px] text-muted-foreground">8 students</p>
                  </div>
                </div>
                <div className="h-1 bg-muted rounded-full">
                  <div className="h-full bg-success rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div className="bg-card rounded-md border p-2">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded bg-warning/10 flex items-center justify-center">
                    <BookOpen className="h-2.5 w-2.5 text-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] font-medium truncate">Sec 2 English</p>
                    <p className="text-[7px] text-muted-foreground">15 students</p>
                  </div>
                </div>
                <div className="h-1 bg-muted rounded-full">
                  <div className="h-full bg-warning rounded-full" style={{ width: '62%' }} />
                </div>
              </div>
              <div className="bg-card rounded-md border p-2">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded bg-info/10 flex items-center justify-center">
                    <BookOpen className="h-2.5 w-2.5 text-info" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] font-medium truncate">Sec 1 Physics</p>
                    <p className="text-[7px] text-muted-foreground">10 students</p>
                  </div>
                </div>
                <div className="h-1 bg-muted rounded-full">
                  <div className="h-full bg-info rounded-full" style={{ width: '33%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .admin-preview-container.paused .anim-chrome,
        .admin-preview-container.paused .anim-section-header,
        .admin-preview-container.paused .anim-section-stats,
        .admin-preview-container.paused .anim-section-middle,
        .admin-preview-container.paused .anim-section-courses {
          opacity: 0;
        }
        
        .admin-preview-container.animate .anim-chrome {
          animation: admin-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .admin-preview-container.animate .anim-section-header {
          animation: admin-slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
        }
        
        .admin-preview-container.animate .anim-section-stats {
          animation: admin-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
        }
        
        .admin-preview-container.animate .anim-section-middle {
          animation: admin-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.9s forwards;
        }
        
        .admin-preview-container.animate .anim-section-courses {
          animation: admin-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 1.3s forwards;
        }
        
        @keyframes admin-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes admin-slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes admin-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
