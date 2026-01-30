import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Clock } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CourseProgress {
  id: string;
  title: string;
  subject: string;
  level: string;
  chaptersCompleted: number;
  chaptersTotal: number;
  pagesCompleted: number;
  pagesTotal: number;
  completionRate: number;
  lastActivity: string;
}

interface LearningTabProps {
  courses: CourseProgress[];
}

export function LearningTab({ courses }: LearningTabProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-card rounded-lg border border-border/50 p-4 hover:border-border transition-colors"
        >
          <div className="flex items-start gap-4">
            {/* Progress Ring */}
            <ProgressRing progress={course.completionRate} size={48} strokeWidth={4} />
            
            {/* Course Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="font-medium text-foreground truncate">{course.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {course.level} • {course.subject}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="shrink-0 gap-1"
                  onClick={() => navigate(`/app/courses/${course.id}`)}
                >
                  View
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Progress Bars */}
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Chapters</span>
                    <span className="font-medium">{course.chaptersCompleted}/{course.chaptersTotal}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full transition-all" 
                      style={{ width: `${(course.chaptersCompleted / course.chaptersTotal) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Pages</span>
                    <span className="font-medium">{course.pagesCompleted}/{course.pagesTotal}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all" 
                      style={{ width: `${(course.pagesCompleted / course.pagesTotal) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Last Activity */}
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Last activity: {course.lastActivity}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {courses.length === 0 && (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No courses enrolled</p>
        </div>
      )}
    </motion.div>
  );
}
