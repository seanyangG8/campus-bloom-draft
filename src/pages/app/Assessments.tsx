import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  ClipboardList,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  Users,
  Clock,
  CheckCircle2,
  Upload,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { demoAssessments } from "@/lib/assessment-types";
import { demoCourses } from "@/lib/demo-data";
import { useToast } from "@/hooks/use-toast";

export function AssessmentsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<typeof demoAssessments[0] | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  const filteredAssessments = demoAssessments.filter((assessment) =>
    assessment.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCourse = (courseId: string) => {
    return demoCourses.find((c) => c.id === courseId);
  };

  const handleCreateAssessment = () => {
    toast({
      title: "Assessment Created",
      description: "New assessment has been created as a draft.",
    });
    setCreateDialogOpen(false);
    setTimeout(() => navigate('/app/assessments/new-assessment'), 300);
  };

  const handleEditAssessment = (assessment: typeof demoAssessments[0]) => {
    navigate(`/app/assessments/${assessment.id}`);
  };

  const handlePublishAssessment = (assessment: typeof demoAssessments[0]) => {
    toast({
      title: "Assessment Published",
      description: `${assessment.title} is now available to students.`,
    });
  };

  const handleDuplicateAssessment = (assessment: typeof demoAssessments[0]) => {
    toast({
      title: "Assessment Duplicated",
      description: `Copy of ${assessment.title} created.`,
    });
  };

  const handleDeleteAssessment = (assessment: typeof demoAssessments[0]) => {
    toast({
      title: "Assessment Deleted",
      description: `${assessment.title} has been removed.`,
    });
  };

  const handlePreview = (assessment: typeof demoAssessments[0]) => {
    setSelectedAssessment(assessment);
    setPreviewDialogOpen(true);
  };

  // Check if assessment has file upload questions
  const hasFileUploads = (assessmentId: string) => {
    // For demo purposes, check if it's the project submission assessment
    return assessmentId === 'assessment-4';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl font-bold text-foreground">Assessments</h1>
          <p className="text-muted-foreground">Create quizzes, essays, and file submissions</p>
        </motion.div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Create Assessment
        </Button>
      </div>

      {/* Search & Filter */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Assessments Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {filteredAssessments.map((assessment, index) => {
          const course = getCourse(assessment.courseId);
          const hasFiles = hasFileUploads(assessment.id);
          return (
            <motion.div
              key={assessment.id}
              className="bg-card rounded-xl border shadow-card p-5 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {hasFiles ? (
                      <Upload className="h-4 w-4 text-amber-600" />
                    ) : (
                      <ClipboardList className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <StatusBadge
                    status={
                      assessment.status === 'published' ? 'success' :
                      assessment.status === 'draft' ? 'warning' : 'neutral'
                    }
                    label={assessment.status}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover">
                    <DropdownMenuItem onClick={() => handlePreview(assessment)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditAssessment(assessment)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicateAssessment(assessment)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    {assessment.status === 'draft' && (
                      <DropdownMenuItem onClick={() => handlePublishAssessment(assessment)}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Publish
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDeleteAssessment(assessment)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mb-3">
                <h3 className="font-semibold truncate mb-1">{assessment.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {course?.title || "Unknown Course"}
                </p>
              </div>

              {/* Type indicator */}
              {hasFiles && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-3 bg-amber-50 rounded-md px-2 py-1 w-fit">
                  <Upload className="h-3 w-3" />
                  <span>File Submissions</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <ClipboardList className="h-3.5 w-3.5" />
                  <span>{assessment.questionsCount} questions</span>
                </div>
                {assessment.duration > 0 && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{assessment.duration} mins</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{assessment.attempts} attempts</span>
                </div>
                {assessment.avgScore > 0 && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{assessment.avgScore}% avg</span>
                  </div>
                )}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handleEditAssessment(assessment)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Assessment
              </Button>
            </motion.div>
          );
        })}
      </motion.div>

      {filteredAssessments.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg">No assessments found</h3>
          <p className="text-muted-foreground">Create your first assessment to get started.</p>
        </div>
      )}

      {/* Create Assessment Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Assessment</DialogTitle>
            <DialogDescription>
              Set up a new quiz, essay, or file submission for your students.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Assessment Title</Label>
              <Input placeholder="e.g., Chapter 3 Test" />
            </div>
            <div className="space-y-2">
              <Label>Course</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {demoCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input type="number" placeholder="30" />
                <p className="text-xs text-muted-foreground">0 = no limit</p>
              </div>
              <div className="space-y-2">
                <Label>Pass Mark (%)</Label>
                <Input type="number" placeholder="60" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea placeholder="Add any instructions for students..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAssessment}>Create Assessment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedAssessment?.title}</DialogTitle>
            <DialogDescription>Assessment preview and statistics</DialogDescription>
          </DialogHeader>
          {selectedAssessment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="font-medium">{selectedAssessment.questionsCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {selectedAssessment.duration > 0 ? `${selectedAssessment.duration} minutes` : 'No limit'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Attempts</p>
                  <p className="font-medium">{selectedAssessment.attempts}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="font-medium">{selectedAssessment.avgScore || 'N/A'}%</p>
                </div>
              </div>
              {selectedAssessment.description && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">{selectedAssessment.description}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => selectedAssessment && handleEditAssessment(selectedAssessment)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
