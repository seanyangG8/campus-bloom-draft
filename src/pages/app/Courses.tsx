import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter,
  BookOpen,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { EmptyState } from "@/components/ui/empty-state";
import { demoCourses, Course } from "@/lib/demo-data";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CreateCourseDialog } from "@/components/dialogs";

export function CoursesPage() {
  const { toast } = useToast();
  const { currentRole } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [createCourseOpen, setCreateCourseOpen] = useState(false);

  const isAdmin = currentRole === 'admin' || currentRole === 'tutor';

  const filteredCourses = demoCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || course.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleCourseAction = (action: string, course: Course) => {
    switch (action) {
      case "duplicate":
        toast({
          title: "Course Duplicated",
          description: `"${course.title}" has been duplicated.`,
        });
        break;
      case "preview":
        toast({
          title: "Opening Preview",
          description: `Opening preview for "${course.title}"...`,
        });
        break;
      case "delete":
        toast({
          title: "Course Deleted",
          description: `"${course.title}" has been deleted.`,
          variant: "destructive",
        });
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Courses</h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin ? 'Manage your courses and learning content' : 'Your enrolled courses'}
          </p>
        </div>
        {isAdmin && (
          <Button 
            size="sm"
            className="gap-2 w-full sm:w-auto"
            onClick={() => setCreateCourseOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create Course
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {isAdmin && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
                <TabsTrigger value="published" className="text-xs sm:text-sm">Published</TabsTrigger>
                <TabsTrigger value="draft" className="text-xs sm:text-sm">Drafts</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          <Button 
            variant="outline" 
            size="icon"
            className="shrink-0"
            onClick={() => toast({ title: "Filters", description: "Filter panel coming soon." })}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCourses.map((course, index) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              isAdmin={isAdmin} 
              index={index}
              onAction={handleCourseAction}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description={searchQuery ? "Try adjusting your search" : "Create your first course to get started"}
          action={isAdmin ? { label: "Create Course", onClick: () => setCreateCourseOpen(true) } : undefined}
        />
      )}

      {/* Dialogs */}
      <CreateCourseDialog open={createCourseOpen} onOpenChange={setCreateCourseOpen} />
    </div>
  );
}

function CourseCard({ 
  course, 
  isAdmin, 
  index,
  onAction,
}: { 
  course: Course; 
  isAdmin: boolean; 
  index: number;
  onAction: (action: string, course: Course) => void;
}) {
  return (
    <div className="bg-card rounded-lg border border-border/50 hover:shadow-sm transition-all duration-200 overflow-hidden group">
      {/* Thumbnail */}
      <div className="aspect-video bg-muted/30 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge 
            status={course.status === 'published' ? 'success' : course.status === 'draft' ? 'warning' : 'neutral'} 
            label={course.status}
          />
        </div>
        {isAdmin && (
          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link to={`/app/courses/${course.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Course
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction("duplicate", course)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction("preview", course)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => onAction("delete", course)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{course.subject} • {course.level}</p>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {course.title}
            </h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {course.description}
        </p>
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{course.chaptersCount} chapters</span>
            <span>{course.studentsEnrolled} students</span>
          </div>
          {course.studentsEnrolled > 0 && (
            <ProgressRing progress={course.completionRate} size={32} strokeWidth={3} />
          )}
        </div>
        <div className="mt-4">
          <Link to={`/app/courses/${course.id}`}>
            <Button variant="outline" className="w-full">
              {isAdmin ? 'Edit Course' : 'Continue Learning'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
