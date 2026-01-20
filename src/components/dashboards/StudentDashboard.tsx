import { motion } from "framer-motion";
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
import { Link } from "react-router-dom";

export function StudentDashboard() {
  const nextSession = demoSessions.find(s => s.status === 'scheduled');
  const enrolledCourses = demoCourses.filter(c => c.status === 'published').slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Welcome back, Wei Lin! 👋</h1>
          <p className="text-muted-foreground">Keep up the great work. You're making progress!</p>
        </div>
        <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
          <Star className="h-4 w-4 text-accent" />
          <span className="font-semibold text-accent">450 points</span>
        </div>
      </div>

      {/* Next Session CTA */}
      {nextSession && (
        <motion.div
          className="gradient-learning rounded-2xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm mb-1">Your next class</p>
              <h2 className="font-display text-xl font-bold mb-2">{nextSession.title}</h2>
              <div className="flex items-center gap-4 text-sm text-white/80">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {nextSession.date}
                </span>
                <span>{nextSession.time}</span>
              </div>
            </div>
            <Button size="lg" variant="secondary" className="gap-2">
              <Play className="h-4 w-4" />
              Join Class
            </Button>
          </div>
        </motion.div>
      )}

      {/* This Week's Plan */}
      <motion.div
        className="bg-card rounded-xl border shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">This Week's Plan</h2>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <ProgressRing progress={60} size={64} strokeWidth={5} />
            <div>
              <p className="text-2xl font-bold">3 of 5</p>
              <p className="text-sm text-muted-foreground">pages completed this week</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg border border-success/20">
              <span className="text-sm">Complete "Quadratic Formula" page</span>
              <span className="text-xs text-success font-medium">In Progress</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm">Submit whiteboard activity</span>
              <span className="text-xs text-muted-foreground">Due Tomorrow</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* My Courses */}
      <motion.div
        className="bg-card rounded-xl border shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">My Courses</h2>
          </div>
          <Link to="/app/courses">
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrolledCourses.map((course) => (
            <Link 
              key={course.id}
              to={`/app/courses/${course.id}`}
              className="p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <ProgressRing progress={course.completionRate} size={40} strokeWidth={4} />
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {course.chaptersCount} chapters • {course.level}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Continue Learning
              </Button>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        className="bg-card rounded-xl border shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-warning" />
            <h2 className="font-semibold">Recent Achievements</h2>
          </div>
        </div>
        <div className="p-4 flex items-center gap-4">
          <div className="flex items-center gap-3 p-3 bg-warning/5 rounded-lg border border-warning/20">
            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
              <Star className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium">Quiz Master</p>
              <p className="text-xs text-muted-foreground">3 perfect scores</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-accent/5 rounded-lg border border-accent/20">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">Week Streak</p>
              <p className="text-xs text-muted-foreground">5 days active</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
