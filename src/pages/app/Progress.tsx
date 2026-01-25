import { motion } from "framer-motion";
import { 
  Trophy, 
  BookOpen, 
  Clock, 
  Target,
  TrendingUp,
  CheckCircle2,
  Circle,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { StatusBadge } from "@/components/ui/status-badge";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { demoCourses, demoStudents } from "@/lib/demo-data";

const studentProgress = {
  overallCompletion: 72,
  coursesEnrolled: 2,
  hoursLearned: 48,
  streakDays: 12,
  badges: [
    { id: 1, name: "Quick Learner", icon: "⚡", earned: true },
    { id: 2, name: "Perfect Quiz", icon: "🎯", earned: true },
    { id: 3, name: "7-Day Streak", icon: "🔥", earned: true },
    { id: 4, name: "Chapter Master", icon: "📚", earned: false },
  ],
  recentActivity: [
    { id: 1, action: "Completed", item: "Quadratic Formula Quiz", time: "2 hours ago", type: "quiz" },
    { id: 2, action: "Watched", item: "Video: Indices Rules", time: "Yesterday", type: "video" },
    { id: 3, action: "Submitted", item: "Whiteboard: Practice Problems", time: "2 days ago", type: "submission" },
  ],
  courseProgress: [
    { courseId: "course-1", title: "Secondary 3 Mathematics", progress: 78, chaptersCompleted: 6, totalChapters: 8 },
    { courseId: "course-2", title: "Primary 6 Science", progress: 45, chaptersCompleted: 5, totalChapters: 12 },
  ],
};

export function ProgressPage() {
  const navigate = useNavigate();
  const { currentRole } = useApp();
  
  // For parent view, show child's progress
  const isParent = currentRole === 'parent';
  const studentName = isParent ? demoStudents[0].name : "Your";

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl font-bold text-foreground">
          {isParent ? `${studentName}'s Progress` : "My Progress"}
        </h1>
        <p className="text-muted-foreground">
          {isParent ? "Track your child's learning journey" : "Track your learning achievements"}
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Progress"
          value={`${studentProgress.overallCompletion}%`}
          icon={Target}
          trend={{ value: 5, label: "this week", positive: true }}
        />
        <StatCard
          title="Courses Enrolled"
          value={studentProgress.coursesEnrolled}
          icon={BookOpen}
        />
        <StatCard
          title="Hours Learned"
          value={studentProgress.hoursLearned}
          icon={Clock}
          trend={{ value: 8, label: "this month", positive: true }}
        />
        <StatCard
          title="Day Streak"
          value={studentProgress.streakDays}
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Progress */}
        <div className="lg:col-span-2 bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Course Progress</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/app/courses')}>
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="divide-y divide-border/50">
            {studentProgress.courseProgress.map((course) => (
              <div
                key={course.courseId}
                className="py-4 first:pt-0 last:pb-0 hover:bg-muted/30 transition-colors cursor-pointer -mx-2 px-2 rounded-lg"
                onClick={() => navigate(`/app/courses/${course.courseId}`)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium truncate">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.chaptersCompleted} of {course.totalChapters} chapters completed
                    </p>
                  </div>
                  <ProgressRing 
                    progress={course.progress} 
                    size={56} 
                    strokeWidth={5}
                    className="shrink-0"
                  />
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-accent" />
            <h2 className="font-semibold">Achievements</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {studentProgress.badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-lg border text-center transition-all ${
                  badge.earned 
                    ? 'bg-accent/10 border-accent/30' 
                    : 'bg-muted/30 border-border opacity-50'
                }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <p className="text-xs font-medium truncate">{badge.name}</p>
                {badge.earned && (
                  <CheckCircle2 className="h-3 w-3 text-accent mx-auto mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="font-semibold mb-4">Recent Activity</h2>
        <div className="divide-y divide-border/50">
          {studentProgress.recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:bg-muted/30 transition-colors -mx-2 px-2 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {activity.type === 'quiz' && <Target className="h-4 w-4 text-primary" />}
                {activity.type === 'video' && <BookOpen className="h-4 w-4 text-primary" />}
                {activity.type === 'submission' && <CheckCircle2 className="h-4 w-4 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.item}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              <StatusBadge 
                status={activity.type === 'quiz' ? 'success' : 'info'} 
                label={activity.type} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}