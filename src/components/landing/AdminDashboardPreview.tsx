import { useEffect, useRef, useState } from "react";
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  AlertTriangle,
  Video,
  FileText,
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
              app.learncampus.com/admin/dashboard
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-4 overflow-hidden">
          {/* Header */}
          <div className="mb-4 anim-slide-down">
            <h2 className="text-sm font-semibold text-foreground">Today</h2>
            <p className="text-[10px] text-muted-foreground">Welcome back! Here's your overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-card rounded-md border p-2 anim-stat-1">
              <div className="flex items-center gap-1.5 mb-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Students</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold anim-count">48</span>
                <span className="text-[8px] text-success anim-trend">+12%</span>
              </div>
            </div>
            <div className="bg-card rounded-md border p-2 anim-stat-2">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Completion</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold anim-count">67%</span>
              </div>
            </div>
            <div className="bg-card rounded-md border p-2 anim-stat-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Sessions</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold anim-count">6</span>
              </div>
            </div>
            <div className="bg-card rounded-md border p-2 anim-stat-4">
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">Revenue</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold anim-count">$12.4k</span>
                <span className="text-[8px] text-success anim-trend">+8%</span>
              </div>
            </div>
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-3 gap-2">
            {/* At-Risk Students */}
            <div className="bg-card rounded-md border p-2 anim-card-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-warning" />
                  <span className="text-[10px] font-medium">At-Risk</span>
                </div>
                <span className="text-[8px] bg-warning/10 text-warning px-1.5 py-0.5 rounded anim-badge">2 students</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-1.5 rounded bg-muted/50 anim-row-1">
                  <div>
                    <p className="text-[9px] font-medium">Sarah Chen</p>
                    <p className="text-[8px] text-muted-foreground">32% complete</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-warning flex items-center justify-center">
                    <span className="text-[7px] font-medium">32</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-muted/50 anim-row-2">
                  <div>
                    <p className="text-[9px] font-medium">Marcus Lee</p>
                    <p className="text-[8px] text-muted-foreground">28% complete</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-destructive flex items-center justify-center">
                    <span className="text-[7px] font-medium">28</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-card rounded-md border p-2 anim-card-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <Video className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] font-medium">Sessions</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="p-1.5 rounded bg-muted/50 anim-session-1">
                  <p className="text-[9px] font-medium">Algebra Review</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[8px] text-muted-foreground">Today 3pm</span>
                    <span className="text-[7px] bg-primary text-primary-foreground px-1 py-0.5 rounded">Join</span>
                  </div>
                </div>
                <div className="p-1.5 rounded bg-muted/50 anim-session-2">
                  <p className="text-[9px] font-medium">Physics Lab</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[8px] text-muted-foreground">Tomorrow 10am</span>
                    <span className="text-[7px] bg-muted text-muted-foreground px-1 py-0.5 rounded">Scheduled</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices */}
            <div className="bg-card rounded-md border p-2 anim-card-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] font-medium">Invoices</span>
                </div>
              </div>
              <div className="space-y-1.5 mb-2">
                <div className="flex items-center justify-between anim-invoice-1">
                  <span className="text-[9px] text-muted-foreground">Overdue</span>
                  <span className="text-[10px] font-medium text-destructive">2</span>
                </div>
                <div className="flex items-center justify-between anim-invoice-2">
                  <span className="text-[9px] text-muted-foreground">Pending</span>
                  <span className="text-[10px] font-medium text-warning">4</span>
                </div>
              </div>
              <button className="w-full text-[8px] bg-primary text-primary-foreground py-1 rounded anim-generate-btn">
                Generate Invoices
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .admin-preview-container.paused * {
          animation-play-state: paused !important;
          opacity: 0;
        }
        .admin-preview-container.paused .anim-fade-in {
          opacity: 1;
        }
        
        .admin-preview-container.animate .anim-fade-in {
          animation: admin-fade-in 0.4s ease-out forwards;
        }
        .admin-preview-container.animate .anim-slide-down {
          animation: admin-slide-down 0.4s ease-out 0.3s forwards;
        }
        
        .admin-preview-container.animate .anim-stat-1 {
          animation: admin-slide-up 0.3s ease-out 0.5s forwards;
        }
        .admin-preview-container.animate .anim-stat-2 {
          animation: admin-slide-up 0.3s ease-out 0.65s forwards;
        }
        .admin-preview-container.animate .anim-stat-3 {
          animation: admin-slide-up 0.3s ease-out 0.8s forwards;
        }
        .admin-preview-container.animate .anim-stat-4 {
          animation: admin-slide-up 0.3s ease-out 0.95s forwards;
        }
        
        .admin-preview-container.animate .anim-count {
          animation: admin-fade-in 0.3s ease-out 1.3s forwards;
        }
        .admin-preview-container.animate .anim-trend {
          animation: admin-pop 0.3s ease-out 1.5s forwards;
        }
        
        .admin-preview-container.animate .anim-card-1 {
          animation: admin-slide-up 0.3s ease-out 1.8s forwards;
        }
        .admin-preview-container.animate .anim-card-2 {
          animation: admin-slide-up 0.3s ease-out 1.95s forwards;
        }
        .admin-preview-container.animate .anim-card-3 {
          animation: admin-slide-up 0.3s ease-out 2.1s forwards;
        }
        
        .admin-preview-container.animate .anim-badge {
          animation: admin-pop 0.2s ease-out 2.3s forwards;
        }
        .admin-preview-container.animate .anim-row-1 {
          animation: admin-fade-in 0.2s ease-out 2.5s forwards;
        }
        .admin-preview-container.animate .anim-row-2 {
          animation: admin-fade-in 0.2s ease-out 2.7s forwards;
        }
        
        .admin-preview-container.animate .anim-session-1 {
          animation: admin-fade-in 0.2s ease-out 2.5s forwards;
        }
        .admin-preview-container.animate .anim-session-2 {
          animation: admin-fade-in 0.2s ease-out 2.7s forwards;
        }
        
        .admin-preview-container.animate .anim-invoice-1 {
          animation: admin-fade-in 0.2s ease-out 2.5s forwards;
        }
        .admin-preview-container.animate .anim-invoice-2 {
          animation: admin-fade-in 0.2s ease-out 2.7s forwards;
        }
        .admin-preview-container.animate .anim-generate-btn {
          animation: admin-pulse 0.5s ease-out 3.2s forwards;
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
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes admin-pop {
          0% { opacity: 0; transform: scale(0.8); }
          70% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes admin-pulse {
          0% { opacity: 0; }
          50% { opacity: 1; box-shadow: 0 0 0 4px hsl(var(--primary) / 0.3); }
          100% { opacity: 1; box-shadow: none; }
        }
      `}</style>
    </div>
  );
}
