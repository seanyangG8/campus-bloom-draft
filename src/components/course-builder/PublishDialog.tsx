import { useState } from "react";
import { 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Users,
  Clock,
  Eye
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCourseBuilder } from "@/contexts/CourseBuilderContext";
import { Course } from "@/lib/demo-data";

interface PublishDialogProps {
  course: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ChangeItem {
  type: 'added' | 'modified' | 'removed';
  category: 'chapter' | 'page' | 'block';
  title: string;
}

// Mock changes for demo
const mockChanges: ChangeItem[] = [
  { type: 'added', category: 'page', title: 'The Quadratic Formula' },
  { type: 'modified', category: 'block', title: 'Video: Deriving the Formula' },
  { type: 'added', category: 'block', title: 'Quick Check Quiz' },
  { type: 'modified', category: 'page', title: 'Solving by Factorisation' },
];

export function PublishDialog({ course, open, onOpenChange }: PublishDialogProps) {
  const { toast } = useToast();
  const { getChaptersByCourse, getPagesByChapter, getBlocksByPage } = useCourseBuilder();
  const [notifyStudents, setNotifyStudents] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const chapters = getChaptersByCourse(course.id);
  const totalPages = chapters.reduce((acc, ch) => acc + getPagesByChapter(ch.id).length, 0);
  const totalBlocks = chapters.reduce((acc, ch) => {
    const pages = getPagesByChapter(ch.id);
    return acc + pages.reduce((pAcc, p) => pAcc + getBlocksByPage(p.id).length, 0);
  }, 0);

  const handlePublish = async () => {
    setIsPublishing(true);
    
    // Simulate publish delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Course Published",
      description: `${course.title} is now live for ${course.studentsEnrolled} students.`,
    });
    
    setIsPublishing(false);
    onOpenChange(false);
  };

  const getChangeIcon = (type: ChangeItem['type']) => {
    switch (type) {
      case 'added': return <span className="text-success">+</span>;
      case 'modified': return <span className="text-warning">~</span>;
      case 'removed': return <span className="text-destructive">−</span>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Publish Changes
          </DialogTitle>
          <DialogDescription>
            Review and publish your changes to make them visible to students.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Course Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <FileText className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
              <p className="text-lg font-semibold">{totalPages}</p>
              <p className="text-xs text-muted-foreground">Pages</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <Eye className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
              <p className="text-lg font-semibold">{totalBlocks}</p>
              <p className="text-xs text-muted-foreground">Blocks</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <Users className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
              <p className="text-lg font-semibold">{course.studentsEnrolled}</p>
              <p className="text-xs text-muted-foreground">Students</p>
            </div>
          </div>

          {/* Changes Summary */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/50 px-3 py-2 border-b flex items-center justify-between">
              <span className="text-sm font-medium">Changes to Publish</span>
              <span className="text-xs text-muted-foreground">{mockChanges.length} items</span>
            </div>
            <div className="divide-y max-h-[150px] overflow-y-auto">
              {mockChanges.map((change, index) => (
                <div key={index} className="px-3 py-2 flex items-center gap-2 text-sm">
                  <span className="w-4 text-center font-mono">{getChangeIcon(change.type)}</span>
                  <span className="flex-1 truncate">{change.title}</span>
                  <span className="text-xs text-muted-foreground capitalize">{change.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What students will see */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Eye className="h-4 w-4 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-primary">What students will see:</p>
                <ul className="mt-1 space-y-0.5 text-muted-foreground text-xs">
                  <li>• New pages and content become available immediately</li>
                  <li>• Updated content replaces previous versions</li>
                  <li>• Removed content is no longer accessible</li>
                  <li>• Student progress on existing content is preserved</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Warning for enrolled students */}
          {course.studentsEnrolled > 0 && (
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-warning">
                    {course.studentsEnrolled} student{course.studentsEnrolled !== 1 ? 's' : ''} enrolled
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Changes will be visible to all enrolled students once published.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notify students option */}
          <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
            <Checkbox
              id="notify"
              checked={notifyStudents}
              onCheckedChange={(checked) => setNotifyStudents(checked as boolean)}
            />
            <div className="grid gap-1">
              <Label htmlFor="notify" className="cursor-pointer font-medium text-sm">
                Notify students of updates
              </Label>
              <p className="text-xs text-muted-foreground">
                Send a notification about new content to enrolled students
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handlePublish} 
            disabled={isPublishing}
            className="gap-2"
          >
            {isPublishing ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Publish Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
