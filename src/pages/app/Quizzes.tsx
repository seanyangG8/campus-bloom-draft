import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  HelpCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  Users,
  Clock,
  CheckCircle2
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
import { demoQuizzes } from "@/lib/quiz-types";
import { demoCourses } from "@/lib/demo-data";
import { useToast } from "@/hooks/use-toast";

export function QuizzesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<typeof demoQuizzes[0] | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  const filteredQuizzes = demoQuizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCourse = (courseId: string) => {
    return demoCourses.find((c) => c.id === courseId);
  };

  const handleCreateQuiz = () => {
    toast({
      title: "Quiz Created",
      description: "New quiz has been created as a draft.",
    });
    setCreateDialogOpen(false);
    // Navigate to the new quiz builder
    setTimeout(() => navigate('/app/quizzes/new-quiz'), 300);
  };

  const handleEditQuiz = (quiz: typeof demoQuizzes[0]) => {
    navigate(`/app/quizzes/${quiz.id}`);
  };

  const handlePublishQuiz = (quiz: typeof demoQuizzes[0]) => {
    toast({
      title: "Quiz Published",
      description: `${quiz.title} is now available to students.`,
    });
  };

  const handleDuplicateQuiz = (quiz: typeof demoQuizzes[0]) => {
    toast({
      title: "Quiz Duplicated",
      description: `Copy of ${quiz.title} created.`,
    });
  };

  const handleDeleteQuiz = (quiz: typeof demoQuizzes[0]) => {
    toast({
      title: "Quiz Deleted",
      description: `${quiz.title} has been removed.`,
    });
  };

  const handlePreview = (quiz: typeof demoQuizzes[0]) => {
    setSelectedQuiz(quiz);
    setPreviewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl font-bold text-foreground">Quizzes</h1>
          <p className="text-muted-foreground">Create and manage assessments</p>
        </motion.div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Create Quiz
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
            placeholder="Search quizzes..."
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

      {/* Quizzes Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {filteredQuizzes.map((quiz, index) => {
          const course = getCourse(quiz.courseId);
          return (
            <motion.div
              key={quiz.id}
              className="bg-card rounded-xl border shadow-card p-5 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <HelpCircle className="h-4 w-4 text-primary" />
                  </div>
                  <StatusBadge
                    status={
                      quiz.status === 'published' ? 'success' :
                      quiz.status === 'draft' ? 'warning' : 'neutral'
                    }
                    label={quiz.status}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover">
                    <DropdownMenuItem onClick={() => handlePreview(quiz)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditQuiz(quiz)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Quiz
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicateQuiz(quiz)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    {quiz.status === 'draft' && (
                      <DropdownMenuItem onClick={() => handlePublishQuiz(quiz)}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Publish
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDeleteQuiz(quiz)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mb-3">
                <h3 className="font-semibold truncate mb-1">{quiz.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {course?.title || "Unknown Course"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>{quiz.questionsCount} questions</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{quiz.duration} mins</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{quiz.attempts} attempts</span>
                </div>
                {quiz.avgScore > 0 && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{quiz.avgScore}% avg</span>
                  </div>
                )}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handlePreview(quiz)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Quiz
              </Button>
            </motion.div>
          );
        })}
      </motion.div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg">No quizzes found</h3>
          <p className="text-muted-foreground">Create your first quiz to get started.</p>
        </div>
      )}

      {/* Create Quiz Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Quiz</DialogTitle>
            <DialogDescription>
              Set up a new assessment for your students.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Quiz Title</Label>
              <Input placeholder="e.g., Chapter 3 Assessment" />
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
              </div>
              <div className="space-y-2">
                <Label>Pass Mark (%)</Label>
                <Input type="number" placeholder="60" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Instructions (Optional)</Label>
              <Textarea placeholder="Add any instructions for students..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateQuiz}>Create Quiz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedQuiz?.title}</DialogTitle>
            <DialogDescription>Quiz preview and statistics</DialogDescription>
          </DialogHeader>
          {selectedQuiz && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="font-medium">{selectedQuiz.questionsCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedQuiz.duration} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Attempts</p>
                  <p className="font-medium">{selectedQuiz.attempts}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="font-medium">{selectedQuiz.avgScore || 'N/A'}%</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground mb-2">Quiz Editor Coming Soon</p>
                <p className="text-xs text-muted-foreground">
                  Add multiple choice, true/false, and open-ended questions.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              Close
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Questions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}