import { useState } from "react";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Clock,
  ArrowRight,
  Video,
  FileText,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { demoCourses, demoStudents, demoSessions, demoInvoices } from "@/lib/demo-data";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { GenerateInvoicesDialog } from "@/components/dialogs";

export function AdminDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [generateInvoicesOpen, setGenerateInvoicesOpen] = useState(false);

  const atRiskStudents = demoStudents.filter(s => s.status === 'at-risk');
  const upcomingSessions = demoSessions.filter(s => s.status === 'scheduled');
  const overdueInvoices = demoInvoices.filter(i => i.status === 'overdue');
  const pendingInvoices = demoInvoices.filter(i => i.status === 'pending');

  const handleJoinLink = (session: typeof demoSessions[0]) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank');
    } else {
      toast({
        title: "No Meeting Link",
        description: "Meeting link not available for this session.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening at your centre.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Students"
          value={demoStudents.length}
          subtitle="Across all cohorts"
          icon={Users}
          trend={{ value: 12, label: "vs last month", positive: true }}
        />
        <StatCard
          title="Course Completion"
          value="67%"
          subtitle="Average across courses"
          icon={TrendingUp}
        />
        <StatCard
          title="This Week Sessions"
          value={upcomingSessions.length}
          subtitle="Live classes scheduled"
          icon={Calendar}
        />
        <StatCard
          title="Revenue (MTD)"
          value="$12,480"
          subtitle="From 26 paid invoices"
          icon={DollarSign}
          trend={{ value: 8, label: "vs last month", positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* At-Risk Students */}
        <div className="lg:col-span-1 bg-card rounded-lg border">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h2 className="text-sm font-medium">At-Risk Students</h2>
            </div>
            <StatusBadge
              status="warning"
              label={`${atRiskStudents.length} student${atRiskStudents.length === 1 ? "" : "s"}`}
            />
          </div>
          <div className="p-4 space-y-2">
            {atRiskStudents.length > 0 ? (
              atRiskStudents.map((student) => (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => navigate(`/app/students/${student.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">Last active: {student.lastActive}</p>
                    </div>
                  </div>
                  <ProgressRing progress={student.completionRate} size={32} strokeWidth={2} variant="warning" />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No at-risk students</p>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2 gap-2 text-muted-foreground"
              onClick={() => navigate('/app/students')}
            >
              View All Students
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="lg:col-span-1 bg-card rounded-lg border">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium">Upcoming Sessions</h2>
            </div>
            <Link to="/app/timetable">
              <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </Link>
          </div>
          <div className="p-4 space-y-2">
            {upcomingSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="p-3 rounded-md hover:bg-muted transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium">{session.title}</p>
                    <p className="text-xs text-muted-foreground">{session.date} at {session.time}</p>
                  </div>
                  <StatusBadge status="info" label="Scheduled" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {session.totalStudents} students
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => handleJoinLink(session)}
                  >
                    Join Link
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="lg:col-span-1 bg-card rounded-lg border">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium">Invoices</h2>
            </div>
            <Link to="/app/invoices">
              <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {overdueInvoices.length > 0 && (
              <div className="p-3 border rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-3 w-3 text-destructive" />
                  <span className="text-xs font-medium text-destructive">Overdue</span>
                </div>
                <p className="text-xl font-semibold">{overdueInvoices.length}</p>
                <p className="text-xs text-muted-foreground">
                  Total: ${overdueInvoices.reduce((sum, i) => sum + i.amount, 0)}
                </p>
              </div>
            )}
            <div className="p-3 border rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-3 w-3 text-warning" />
                <span className="text-xs font-medium text-warning">Pending</span>
              </div>
              <p className="text-xl font-semibold">{pendingInvoices.length}</p>
              <p className="text-xs text-muted-foreground">
                Total: ${pendingInvoices.reduce((sum, i) => sum + i.amount, 0)}
              </p>
            </div>
            <Button 
              className="w-full"
              onClick={() => setGenerateInvoicesOpen(true)}
            >
              Generate Invoices
            </Button>
          </div>
        </div>
      </div>

      {/* Course Overview */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-medium">Courses Overview</h2>
          </div>
          <Link to="/app/courses">
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              Manage Courses
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {demoCourses.filter(c => c.status === 'published').map((course) => (
              <Link 
                key={course.id} 
                to={`/app/courses/${course.id}`}
                className="p-4 rounded-md hover:bg-muted transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <StatusBadge 
                    status={course.status === 'published' ? 'success' : 'neutral'} 
                    label={course.status} 
                  />
                </div>
                <h3 className="font-medium text-sm mb-1">
                  {course.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {course.level} • {course.chaptersCount} chapters
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {course.studentsEnrolled} students
                  </span>
                  <ProgressRing progress={course.completionRate} size={28} strokeWidth={2} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <GenerateInvoicesDialog 
        open={generateInvoicesOpen} 
        onOpenChange={setGenerateInvoicesOpen} 
      />
    </div>
  );
}
