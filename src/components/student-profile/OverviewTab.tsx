import { motion } from "framer-motion";
import { BookOpen, AlertTriangle, TrendingUp, Calendar, Award, Clock } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ActivityTimeline, ActivityEvent } from "./ActivityTimeline";

interface CourseEnrollment {
  id: string;
  title: string;
  level: string;
  progress: number;
  status: string;
}

interface OverviewTabProps {
  student: {
    name: string;
    status: 'active' | 'inactive' | 'at-risk';
    completionRate: number;
    enrolledCourses: number;
    makeUpCredits: number;
    lastActive: string;
  };
  courses: CourseEnrollment[];
  attendanceRate: number;
  activityEvents: ActivityEvent[];
}

export function OverviewTab({ student, courses, attendanceRate, activityEvents }: OverviewTabProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Main Content - 2 columns */}
      <div className="lg:col-span-2 space-y-6">
        {/* At-Risk Alert */}
        {student.status === 'at-risk' && (
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">At-Risk Student</p>
              <p className="text-xs text-muted-foreground mt-1">
                Low activity detected. Last active {student.lastActive}. Consider reaching out to check on progress.
              </p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-card rounded-lg border border-border/50 p-4 text-center">
            <ProgressRing progress={student.completionRate} size={40} strokeWidth={4} />
            <p className="text-xs text-muted-foreground mt-2">Overall Progress</p>
          </div>
          <div className="bg-card rounded-lg border border-border/50 p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{student.enrolledCourses}</p>
            <p className="text-xs text-muted-foreground mt-1">Courses</p>
          </div>
          <div className="bg-card rounded-lg border border-border/50 p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{attendanceRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">Attendance</p>
          </div>
          <div className="bg-card rounded-lg border border-border/50 p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{student.makeUpCredits}</p>
            <p className="text-xs text-muted-foreground mt-1">Make-up Credits</p>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-card rounded-lg border border-border/50">
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              Enrolled Courses
            </h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => navigate('/app/courses')}
            >
              View All
            </Button>
          </div>
          <div className="divide-y divide-border/50">
            {courses.map((course) => (
              <div 
                key={course.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => navigate(`/app/courses/${course.id}`)}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-foreground truncate">{course.title}</p>
                  <p className="text-xs text-muted-foreground">{course.level}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{course.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar - Activity Timeline */}
      <div className="lg:col-span-1">
        <div className="bg-card rounded-lg border border-border/50 p-4 sticky top-4">
          <ActivityTimeline events={activityEvents} />
        </div>
      </div>
    </motion.div>
  );
}
