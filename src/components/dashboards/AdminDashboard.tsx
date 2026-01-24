import { useState } from "react";
import { motion } from "framer-motion";
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
        <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening at your centre.</p>
      </div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
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
          variant="accent"
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
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* At-Risk Students */}
        <motion.div 
          className="lg:col-span-1 bg-card rounded-xl border shadow-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h2 className="font-semibold">At-Risk Students</h2>
            </div>
            <StatusBadge status="warning" label={`${atRiskStudents.length} students`} />
          </div>
          <div className="p-4 space-y-3">
            {atRiskStudents.length > 0 ? (
              atRiskStudents.map((student) => (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => navigate(`/app/students/${student.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-warning">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">Last active: {student.lastActive}</p>
                    </div>
                  </div>
                  <ProgressRing progress={student.completionRate} size={36} strokeWidth={3} variant="warning" />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No at-risk students</p>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2 gap-2"
              onClick={() => navigate('/app/students')}
            >
              View All Students
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div 
          className="lg:col-span-1 bg-card rounded-xl border shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-info" />
              <h2 className="font-semibold">Upcoming Sessions</h2>
            </div>
            <Link to="/app/timetable">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {upcomingSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium">{session.title}</p>
                    <p className="text-xs text-muted-foreground">{session.date} at {session.time}</p>
                  </div>
                  <StatusBadge status="info" label="Scheduled" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {session.totalStudents} students enrolled
                  </span>
                  <Button 
                    variant="outline" 
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
        </motion.div>

        {/* Invoice Summary */}
        <motion.div 
          className="lg:col-span-1 bg-card rounded-xl border shadow-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold">Invoices</h2>
            </div>
            <Link to="/app/invoices">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="p-4 space-y-4">
            {overdueInvoices.length > 0 && (
              <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">Overdue</span>
                </div>
                <p className="text-2xl font-bold">{overdueInvoices.length}</p>
                <p className="text-xs text-muted-foreground">
                  Total: ${overdueInvoices.reduce((sum, i) => sum + i.amount, 0)}
                </p>
              </div>
            )}
            <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium text-warning">Pending</span>
              </div>
              <p className="text-2xl font-bold">{pendingInvoices.length}</p>
              <p className="text-xs text-muted-foreground">
                Total: ${pendingInvoices.reduce((sum, i) => sum + i.amount, 0)}
              </p>
            </div>
            <Button 
              className="w-full gradient-hero text-primary-foreground"
              onClick={() => setGenerateInvoicesOpen(true)}
            >
              Generate Invoices
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Course Overview */}
      <motion.div 
        className="bg-card rounded-xl border shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Courses Overview</h2>
          </div>
          <Link to="/app/courses">
            <Button variant="outline" size="sm" className="gap-2">
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
                className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <StatusBadge 
                    status={course.status === 'published' ? 'success' : 'neutral'} 
                    label={course.status} 
                  />
                </div>
                <h3 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {course.level} • {course.chaptersCount} chapters
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {course.studentsEnrolled} students
                  </span>
                  <ProgressRing progress={course.completionRate} size={32} strokeWidth={3} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Dialogs */}
      <GenerateInvoicesDialog 
        open={generateInvoicesOpen} 
        onOpenChange={setGenerateInvoicesOpen} 
      />
    </div>
  );
}
