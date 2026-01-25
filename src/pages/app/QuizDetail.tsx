import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Eye,
  Save,
  Settings,
  Clock,
  HelpCircle,
  Target,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QuizBuilderProvider, useQuizBuilder } from '@/contexts/QuizBuilderContext';
import { QuestionList } from '@/components/quiz-builder/QuestionList';
import { QuestionEditor } from '@/components/quiz-builder/QuestionEditor';
import { QuestionLibrary } from '@/components/quiz-builder/QuestionLibrary';
import { QuizPreviewDialog } from '@/components/quiz-builder/QuizPreviewDialog';
import { demoQuizzes } from '@/lib/quiz-types';
import { demoCourses } from '@/lib/demo-data';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

export function QuizDetailPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  // Handle new quiz creation
  const isNewQuiz = quizId === 'new-quiz';
  const quiz = isNewQuiz ? null : demoQuizzes.find((q) => q.id === quizId);

  if (!quiz && !isNewQuiz) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Quiz not found</h2>
          <Button variant="outline" onClick={() => navigate('/app/quizzes')}>
            Back to Quizzes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <QuizBuilderProvider quizId={quizId || 'new-quiz'}>
      <QuizBuilder />
    </QuizBuilderProvider>
  );
}

function QuizBuilder() {
  const navigate = useNavigate();
  const { currentRole } = useApp();
  const { quiz, questions, updateQuiz, getTotalPoints } = useQuizBuilder();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const course = quiz?.courseId
    ? demoCourses.find((c) => c.id === quiz.courseId)
    : null;

  const isAdmin = currentRole === 'admin' || currentRole === 'tutor';
  const totalPoints = getTotalPoints();

  const handlePublish = () => {
    if (quiz) {
      updateQuiz({ status: 'published' });
      toast.success('Quiz published successfully');
    }
  };

  const handleSave = () => {
    toast.success('Quiz saved');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/app/quizzes')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display text-xl font-bold">
                {quiz?.title || 'New Quiz'}
              </h1>
              {quiz && (
                <StatusBadge
                  status={
                    quiz.status === 'published'
                      ? 'success'
                      : quiz.status === 'draft'
                      ? 'warning'
                      : 'neutral'
                  }
                  label={quiz.status}
                />
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {course && <span>{course.title}</span>}
              <span className="flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5" />
                {questions.length} {questions.length === 1 ? 'question' : 'questions'}
              </span>
              <span className="flex items-center gap-1">
                <Target className="h-3.5 w-3.5" />
                {totalPoints} {totalPoints === 1 ? 'point' : 'points'}
              </span>
              {quiz && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {quiz.duration} mins
                </span>
              )}
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettingsOpen(true)}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewOpen(true)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button size="sm" onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
            {quiz?.status === 'draft' && (
              <Button
                size="sm"
                variant="premium"
                onClick={handlePublish}
              >
                Publish
              </Button>
            )}
          </div>
        )}
      </motion.div>

      {/* Builder Layout */}
      <div className="grid grid-cols-12 gap-4 min-h-[calc(100vh-12rem)]">
        {/* Question List - Left Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-12 md:col-span-3"
        >
          <QuestionList />
        </motion.div>

        {/* Question Editor - Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-12 md:col-span-6"
        >
          <QuestionEditor />
        </motion.div>

        {/* Question Library - Right Sidebar */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-12 md:col-span-3"
          >
            <QuestionLibrary />
          </motion.div>
        )}
      </div>

      {/* Preview Dialog */}
      <QuizPreviewDialog
        quiz={quiz}
        questions={questions}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />

      {/* Settings Dialog */}
      <QuizSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </div>
  );
}

function QuizSettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { quiz, updateQuiz } = useQuizBuilder();

  if (!quiz) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Quiz Settings</DialogTitle>
          <DialogDescription>
            Configure quiz options and restrictions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Quiz Title</Label>
              <Input
                value={quiz.title}
                onChange={(e) => updateQuiz({ title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  min="1"
                  value={quiz.duration}
                  onChange={(e) =>
                    updateQuiz({ duration: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Pass Mark (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={quiz.passMark}
                  onChange={(e) =>
                    updateQuiz({ passMark: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Options</h4>

            <div className="flex items-center justify-between">
              <div>
                <Label>Shuffle Questions</Label>
                <p className="text-xs text-muted-foreground">
                  Randomize question order for each attempt
                </p>
              </div>
              <Switch
                checked={quiz.shuffleQuestions}
                onCheckedChange={(checked) =>
                  updateQuiz({ shuffleQuestions: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Show Results</Label>
                <p className="text-xs text-muted-foreground">
                  Display answers after submission
                </p>
              </div>
              <Switch
                checked={quiz.showResults}
                onCheckedChange={(checked) =>
                  updateQuiz({ showResults: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Retakes</Label>
                <p className="text-xs text-muted-foreground">
                  Students can attempt the quiz multiple times
                </p>
              </div>
              <Switch
                checked={quiz.allowRetakes}
                onCheckedChange={(checked) =>
                  updateQuiz({ allowRetakes: checked })
                }
              />
            </div>

            {quiz.allowRetakes && (
              <div className="space-y-2 pl-4 border-l-2 border-muted">
                <Label>Maximum Attempts</Label>
                <Input
                  type="number"
                  min="1"
                  value={quiz.maxAttempts}
                  onChange={(e) =>
                    updateQuiz({ maxAttempts: parseInt(e.target.value) || 1 })
                  }
                  className="w-24"
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
