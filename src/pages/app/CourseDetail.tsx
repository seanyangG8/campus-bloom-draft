import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, Reorder } from "framer-motion";
import { 
  ArrowLeft,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Settings,
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Play,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoCourses, demoChapters, demoPages, Chapter, Page } from "@/lib/demo-data";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BlockLibrary } from "@/components/course-builder/BlockLibrary";
import { PageEditor } from "@/components/course-builder/PageEditor";

export function CourseDetailPage() {
  const { courseId } = useParams();
  const { currentRole } = useApp();
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [chapters, setChapters] = useState(demoChapters.filter(c => c.courseId === courseId));

  const course = demoCourses.find(c => c.id === courseId);
  const isAdmin = currentRole === 'admin' || currentRole === 'tutor';

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/app/courses">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-foreground">{course.title}</h1>
              <StatusBadge 
                status={course.status === 'published' ? 'success' : 'warning'} 
                label={course.status}
              />
            </div>
            <p className="text-muted-foreground">{course.level} • {course.subject}</p>
          </div>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button className="gradient-hero text-primary-foreground">
              Publish Changes
            </Button>
          </div>
        )}
      </div>

      {/* Course Builder Layout */}
      <div className="grid grid-cols-12 gap-6 min-h-[calc(100vh-12rem)]">
        {/* Chapter/Page Navigation */}
        <motion.div 
          className="col-span-3 bg-card rounded-xl border shadow-card overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">Course Structure</h2>
            {isAdmin && (
              <Button variant="ghost" size="sm" className="gap-1">
                <Plus className="h-3 w-3" />
                Chapter
              </Button>
            )}
          </div>
          <div className="p-2 overflow-y-auto max-h-[calc(100vh-18rem)] scrollbar-thin">
            {chapters.map((chapter, chapterIndex) => (
              <ChapterItem 
                key={chapter.id}
                chapter={chapter}
                pages={demoPages.filter(p => p.chapterId === chapter.id)}
                selectedPageId={selectedPageId}
                onSelectPage={setSelectedPageId}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </motion.div>

        {/* Page Editor */}
        <motion.div 
          className="col-span-6 bg-card rounded-xl border shadow-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {selectedPageId ? (
            <PageEditor pageId={selectedPageId} isAdmin={isAdmin} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>Select a page to edit</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Block Library */}
        {isAdmin && (
          <motion.div 
            className="col-span-3 bg-card rounded-xl border shadow-card overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <BlockLibrary />
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface ChapterItemProps {
  chapter: Chapter;
  pages: Page[];
  selectedPageId: string | null;
  onSelectPage: (pageId: string) => void;
  isAdmin: boolean;
}

function ChapterItem({ chapter, pages, selectedPageId, onSelectPage, isAdmin }: ChapterItemProps) {
  const [isOpen, setIsOpen] = useState(!chapter.isLocked);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="mb-1">
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "w-full flex items-center gap-2 p-2 rounded-lg text-left hover:bg-muted/50 transition-colors",
              chapter.isLocked && "opacity-60"
            )}
          >
            {isAdmin && <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />}
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="flex-1 text-sm font-medium truncate">{chapter.title}</span>
            {chapter.isLocked ? (
              <Lock className="h-3 w-3 text-muted-foreground" />
            ) : (
              <span className="text-xs text-muted-foreground">{pages.length}</span>
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="ml-6 mt-1 space-y-0.5">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => onSelectPage(page.id)}
                className={cn(
                  "w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-colors",
                  selectedPageId === page.id 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                  page.isLocked && "opacity-50"
                )}
              >
                {page.isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                ) : page.isLocked ? (
                  <Lock className="h-3.5 w-3.5 flex-shrink-0" />
                ) : (
                  <div className="h-3.5 w-3.5 rounded-full border flex-shrink-0" />
                )}
                <span className="truncate">{page.title}</span>
                {page.isRequired && (
                  <span className="text-xs text-accent">*</span>
                )}
              </button>
            ))}
            {isAdmin && (
              <button className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <Plus className="h-3.5 w-3.5" />
                Add Page
              </button>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
