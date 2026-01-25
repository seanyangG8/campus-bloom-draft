import { Link, useNavigate } from "react-router-dom";
import { 
  Play, 
  BookOpen, 
  Trophy,
  Calendar,
  ArrowRight,
  Star,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { demoCourses, demoSessions } from "@/lib/demo-data";
import { useToast } from "@/hooks/use-toast";

export function StudentDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const nextSession = demoSessions.find(s => s.status === 'scheduled');
  const enrolledCourses = demoCourses.filter(c => c.status === 'published').slice(0, 2);

  const handleJoinClass = () => {
    if (nextSession?.meetingLink) {
      window.open(nextSession.meetingLink, '_blank');
      toast({
        title: "Joining Class",
        description: `Opening ${nextSession.title}...`,
      });
    } else {
      toast({
        title: "Class Not Started",
        description: "The meeting link will be available when class starts.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Welcome back, Wei Lin!</h1>
          <p className="text-sm text-muted-foreground">Keep up the great work. You're making progress!</p>
        </div>
        <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md">
          <Star className="h-3.5 w-3.5 text-foreground" />
          <span className="text-sm font-medium">450 points</span>
        </div>
      </div>

      {/* Next Session CTA */}
      {nextSession && (
        <div className="bg-foreground rounded-lg p-5 text-background">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-background/60 text-xs mb-1">Your next class</p>
              <h2 className="text-lg font-semibold mb-2">{nextSession.title}</h2>
              <div className="flex items-center gap-4 text-xs text-background/70">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {nextSession.date}
                </span>
                <span>{nextSession.time}</span>
              </div>
            </div>
            <Button 
              variant="secondary" 
              className="gap-2"
              onClick={handleJoinClass}
            >
              <Play className="h-3 w-3" />
              Join Class
            </Button>
          </div>
        </div>
      )}

      {/* This Week's Plan */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-medium">This Week's Plan</h2>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <ProgressRing progress={60} size={56} strokeWidth={4} />
            <div>
              <p className="text-xl font-semibold">3 of 5</p>
              <p className="text-xs text-muted-foreground">pages completed this week</p>
            </div>
          </div>
          <div className="space-y-2">
            <button 
              className="w-full flex items-center justify-between p-3 rounded-md border hover:bg-muted transition-colors text-left"
              onClick={() => navigate('/app/courses/course-1')}
            >
              <span className="text-sm">Complete "Quadratic Formula" page</span>
              <span className="text-xs text-success font-medium">In Progress</span>
            </button>
            <button 
              className="w-full flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors text-left"
              onClick={() => navigate('/app/courses/course-1')}
            >
              <span className="text-sm">Submit whiteboard activity</span>
              <span className="text-xs text-muted-foreground">Due Tomorrow</span>
            </button>
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-medium">My Courses</h2>
          </div>
          <Link to="/app/courses">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              View All <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrolledCourses.map((course) => (
            <Link 
              key={course.id}
              to={`/app/courses/${course.id}`}
              className="p-4 rounded-md hover:bg-muted transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </div>
                <ProgressRing progress={course.completionRate} size={36} strokeWidth={3} />
              </div>
              <h3 className="font-medium text-sm mb-1">
                {course.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                {course.chaptersCount} chapters • {course.level}
              </p>
              <Button variant="outline" size="sm" className="w-full text-xs">
                Continue Learning
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-medium">Recent Achievements</h2>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3">
          <div className="flex items-center gap-3 p-3 rounded-md border">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Star className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium">Quiz Master</p>
              <p className="text-xs text-muted-foreground">3 perfect scores</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-md border">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Target className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">Week Streak</p>
              <p className="text-xs text-muted-foreground">5 days active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
