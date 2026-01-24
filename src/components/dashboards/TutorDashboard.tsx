import { motion } from "framer-motion";
import { 
  Calendar, 
  Video, 
  Users,
  Clock,
  ExternalLink,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoSessions, demoCohorts, demoStudents } from "@/lib/demo-data";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function TutorDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const todaySessions = demoSessions.filter(s => s.status === 'scheduled').slice(0, 2);
  const atRiskStudents = demoStudents.filter(s => s.status === 'at-risk');

  const handleStartClass = (session: typeof demoSessions[0]) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank');
      toast({
        title: "Starting Class",
        description: `Opening ${session.title} meeting link...`,
      });
    } else {
      toast({
        title: "No Meeting Link",
        description: "Please add a meeting link to this session.",
      });
    }
  };

  const handleSessionCompanion = (session: typeof demoSessions[0]) => {
    navigate(`/app/courses/${session.cohortId}`);
    toast({
      title: "Session Companion",
      description: "Opening course materials for this session.",
    });
  };

  const handleExternalLink = (session: typeof demoSessions[0]) => {
    if (session.meetingLink) {
      navigator.clipboard.writeText(session.meetingLink);
      toast({
        title: "Link Copied",
        description: "Meeting link copied to clipboard.",
      });
    }
  };

  const handleReviewSubmissions = () => {
    navigate('/app/courses');
    toast({
      title: "Review Submissions",
      description: "Opening courses to review student submissions.",
    });
  };

  const handleTakeAttendance = () => {
    toast({
      title: "Attendance",
      description: "Attendance tracking will be available during live sessions.",
    });
  };

  const handleMessageParent = (student: typeof demoStudents[0]) => {
    navigator.clipboard.writeText(
      `Hi, this is regarding ${student.name}'s progress. We noticed their completion rate is at ${student.completionRate}% and wanted to discuss ways to help them catch up.`
    );
    toast({
      title: "Message Copied",
      description: "Message template copied to clipboard for WhatsApp.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Today</h1>
        <p className="text-muted-foreground">Welcome back, Mr. Ahmad! Here's your schedule for today.</p>
      </div>

      {/* Today's Sessions */}
      <motion.div
        className="bg-card rounded-xl border shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Today's Sessions</h2>
          </div>
          <StatusBadge status="info" label={`${todaySessions.length} classes`} />
        </div>
        <div className="p-4 space-y-4">
          {todaySessions.map((session, index) => (
            <div 
              key={session.id}
              className="p-4 bg-muted/30 rounded-xl border border-border/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{session.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {demoCohorts.find(c => c.id === session.cohortId)?.name}
                  </p>
                </div>
                <StatusBadge 
                  status={index === 0 ? 'info' : 'neutral'} 
                  label={index === 0 ? 'Up Next' : 'Later'}
                  dot
                />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {session.time}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {session.totalStudents} students
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  className="gradient-accent text-accent-foreground gap-2"
                  onClick={() => handleStartClass(session)}
                >
                  <Video className="h-4 w-4" />
                  Start Class
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleExternalLink(session)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="ml-auto"
                  onClick={() => handleSessionCompanion(session)}
                >
                  Session Companion
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          className="bg-card rounded-xl border shadow-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="p-4 border-b">
            <h2 className="font-semibold">Quick Actions</h2>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2"
              onClick={handleReviewSubmissions}
            >
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm">Review Submissions</span>
              <span className="text-xs text-muted-foreground">12 pending</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2"
              onClick={handleTakeAttendance}
            >
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-sm">Take Attendance</span>
              <span className="text-xs text-muted-foreground">Next session</span>
            </Button>
          </div>
        </motion.div>

        {/* At-Risk Students */}
        <motion.div
          className="bg-card rounded-xl border shadow-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h2 className="font-semibold">At-Risk Students</h2>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {atRiskStudents.map((student) => (
              <div 
                key={student.id} 
                className="flex items-center justify-between p-3 bg-warning/5 rounded-lg border border-warning/20 cursor-pointer hover:bg-warning/10 transition-colors"
                onClick={() => navigate(`/app/students/${student.id}`)}
              >
                <div>
                  <p className="text-sm font-medium">{student.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {student.completionRate}% complete • Last active {student.lastActive}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMessageParent(student);
                  }}
                >
                  Message Parent
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
