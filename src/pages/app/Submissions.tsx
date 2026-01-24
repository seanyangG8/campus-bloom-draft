import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  MessageSquare,
  Download,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { demoStudents, demoCourses } from "@/lib/demo-data";
import { useToast } from "@/hooks/use-toast";

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  type: 'whiteboard' | 'reflection' | 'quiz' | 'assignment';
  title: string;
  courseId: string;
  submittedAt: string;
  status: 'pending' | 'graded' | 'feedback';
  grade?: number;
  feedback?: string;
}

const demoSubmissions: Submission[] = [
  { id: 'sub-1', studentId: 'stu-1', studentName: 'Wei Lin Tan', type: 'whiteboard', title: 'Quadratic Practice Problems', courseId: 'course-1', submittedAt: '2 hours ago', status: 'pending' },
  { id: 'sub-2', studentId: 'stu-2', studentName: 'Aisha Binti Hassan', type: 'reflection', title: 'Chapter 2 Reflection', courseId: 'course-1', submittedAt: '5 hours ago', status: 'pending' },
  { id: 'sub-3', studentId: 'stu-3', studentName: 'Ryan Koh', type: 'quiz', title: 'Indices Quick Check', courseId: 'course-1', submittedAt: 'Yesterday', status: 'graded', grade: 72 },
  { id: 'sub-4', studentId: 'stu-4', studentName: 'Priya Sharma', type: 'whiteboard', title: 'Energy Diagrams', courseId: 'course-2', submittedAt: 'Yesterday', status: 'feedback', grade: 85, feedback: 'Great work! Consider adding more labels.' },
  { id: 'sub-5', studentId: 'stu-5', studentName: 'Muhammad Irfan', type: 'assignment', title: 'Practice Set 3', courseId: 'course-1', submittedAt: '2 days ago', status: 'graded', grade: 90 },
];

export function SubmissionsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [gradeValue, setGradeValue] = useState("");
  const [feedbackValue, setFeedbackValue] = useState("");

  const filteredSubmissions = demoSubmissions.filter((sub) => {
    const matchesSearch = sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = demoSubmissions.filter(s => s.status === 'pending').length;

  const getCourse = (courseId: string) => {
    return demoCourses.find((c) => c.id === courseId);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whiteboard': return '✏️';
      case 'reflection': return '💭';
      case 'quiz': return '📝';
      case 'assignment': return '📄';
      default: return '📋';
    }
  };

  const handleGradeSubmission = () => {
    toast({
      title: "Submission Graded",
      description: `${selectedSubmission?.studentName}'s work has been graded.`,
    });
    setGradeDialogOpen(false);
    setGradeValue("");
    setFeedbackValue("");
  };

  const openGradeDialog = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradeValue(submission.grade?.toString() || "");
    setFeedbackValue(submission.feedback || "");
    setGradeDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl font-bold text-foreground">Submissions</h1>
          <p className="text-muted-foreground">Review and grade student work</p>
        </motion.div>
        {pendingCount > 0 && (
          <StatusBadge 
            status="warning" 
            label={`${pendingCount} pending ${pendingCount === 1 ? 'review' : 'reviews'}`} 
          />
        )}
      </div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-card rounded-xl border shadow-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-2xl font-bold">{pendingCount}</span>
          </div>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="bg-card rounded-xl border shadow-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="text-2xl font-bold">
              {demoSubmissions.filter(s => s.status === 'graded').length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Graded</p>
        </div>
        <div className="bg-card rounded-xl border shadow-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="text-2xl font-bold">
              {demoSubmissions.filter(s => s.status === 'feedback').length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">With Feedback</p>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search submissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="graded">Graded</SelectItem>
            <SelectItem value="feedback">With Feedback</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Submissions Table */}
      <motion.div
        className="bg-card rounded-xl border shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Submission</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => {
                const course = getCourse(submission.courseId);
                return (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm">
                          {submission.studentName.charAt(0)}
                        </div>
                        <span className="font-medium truncate">{submission.studentName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getTypeIcon(submission.type)}</span>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{submission.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">{submission.type}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm truncate">{course?.title}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {submission.submittedAt}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={
                          submission.status === 'pending' ? 'warning' :
                          submission.status === 'graded' ? 'success' : 'info'
                        }
                        label={submission.status}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="font-medium tabular-nums">
                        {submission.grade ? `${submission.grade}%` : '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openGradeDialog(submission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg">No submissions found</h3>
            <p className="text-muted-foreground">Submissions from students will appear here.</p>
          </div>
        )}
      </motion.div>

      {/* Grade Dialog */}
      <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
            <DialogDescription>
              {selectedSubmission?.studentName} - {selectedSubmission?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-4xl mb-2">{selectedSubmission && getTypeIcon(selectedSubmission.type)}</p>
              <p className="text-sm text-muted-foreground">
                {selectedSubmission?.type === 'whiteboard' && 'View whiteboard submission'}
                {selectedSubmission?.type === 'reflection' && 'View reflection response'}
                {selectedSubmission?.type === 'quiz' && 'View quiz answers'}
                {selectedSubmission?.type === 'assignment' && 'View assignment files'}
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <Eye className="h-4 w-4 mr-2" />
                Open Full View
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Grade (%)</Label>
                <Input 
                  type="number" 
                  placeholder="0-100"
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  min={0}
                  max={100}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue={selectedSubmission?.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="graded">Graded</SelectItem>
                    <SelectItem value="feedback">Needs Revision</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Feedback</Label>
              <Textarea 
                placeholder="Add feedback for the student..."
                value={feedbackValue}
                onChange={(e) => setFeedbackValue(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGradeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGradeSubmission}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Save Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}