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
  Filter,
  MoreHorizontal,
  Check,
  FileDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { demoStudents, demoCourses } from "@/lib/demo-data";
import { useToast } from "@/hooks/use-toast";

type SubmissionStatus = 'pending' | 'graded' | 'feedback_given';

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  type: 'whiteboard' | 'reflection' | 'quiz' | 'assignment' | 'essay';
  title: string;
  courseId: string;
  submittedAt: string;
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
  isManualGrading: boolean;
}

const demoSubmissions: Submission[] = [
  { id: 'sub-1', studentId: 'stu-1', studentName: 'Wei Lin Tan', type: 'whiteboard', title: 'Quadratic Practice Problems', courseId: 'course-1', submittedAt: '2 hours ago', status: 'pending', isManualGrading: true },
  { id: 'sub-2', studentId: 'stu-2', studentName: 'Aisha Binti Hassan', type: 'reflection', title: 'Chapter 2 Reflection', courseId: 'course-1', submittedAt: '5 hours ago', status: 'pending', isManualGrading: true },
  { id: 'sub-3', studentId: 'stu-3', studentName: 'Ryan Koh', type: 'quiz', title: 'Indices Quick Check', courseId: 'course-1', submittedAt: 'Yesterday', status: 'graded', grade: 72, isManualGrading: false },
  { id: 'sub-4', studentId: 'stu-4', studentName: 'Priya Sharma', type: 'whiteboard', title: 'Energy Diagrams', courseId: 'course-2', submittedAt: 'Yesterday', status: 'feedback_given', grade: 85, feedback: 'Great work! Consider adding more labels.', isManualGrading: true },
  { id: 'sub-5', studentId: 'stu-5', studentName: 'Muhammad Irfan', type: 'assignment', title: 'Practice Set 3', courseId: 'course-1', submittedAt: '2 days ago', status: 'graded', grade: 90, isManualGrading: true },
  { id: 'sub-6', studentId: 'stu-1', studentName: 'Wei Lin Tan', type: 'essay', title: 'Scientific Method Essay', courseId: 'course-2', submittedAt: '3 days ago', status: 'pending', isManualGrading: true },
];

const statusLabels: Record<SubmissionStatus, string> = {
  pending: 'Pending',
  graded: 'Graded',
  feedback_given: 'Feedback Given',
};

const statusColors: Record<SubmissionStatus, 'warning' | 'success' | 'info'> = {
  pending: 'warning',
  graded: 'success',
  feedback_given: 'info',
};

export function SubmissionsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [gradeValue, setGradeValue] = useState("");
  const [feedbackValue, setFeedbackValue] = useState("");
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [bulkFeedbackOpen, setBulkFeedbackOpen] = useState(false);
  const [bulkFeedbackText, setBulkFeedbackText] = useState("");

  const filteredSubmissions = demoSubmissions.filter((sub) => {
    const matchesSearch = sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = demoSubmissions.filter(s => s.status === 'pending').length;
  const gradedCount = demoSubmissions.filter(s => s.status === 'graded').length;
  const feedbackCount = demoSubmissions.filter(s => s.status === 'feedback_given').length;

  const getCourse = (courseId: string) => {
    return demoCourses.find((c) => c.id === courseId);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whiteboard': return '✏️';
      case 'reflection': return '💭';
      case 'quiz': return '📝';
      case 'assignment': return '📄';
      case 'essay': return '📑';
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

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedSubmissions.length === filteredSubmissions.length) {
      setSelectedSubmissions([]);
    } else {
      setSelectedSubmissions(filteredSubmissions.map(s => s.id));
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedSubmissions(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const isAllSelected = filteredSubmissions.length > 0 && 
    selectedSubmissions.length === filteredSubmissions.length;

  // Bulk actions
  const handleBulkMarkReviewed = () => {
    const count = selectedSubmissions.length;
    toast({
      title: "Marked as Reviewed",
      description: `${count} submission${count !== 1 ? 's' : ''} marked as graded.`,
    });
    setSelectedSubmissions([]);
  };

  const handleBulkAddFeedback = () => {
    if (!bulkFeedbackText.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please enter feedback text.",
        variant: "destructive",
      });
      return;
    }

    const count = selectedSubmissions.length;
    toast({
      title: "Feedback Added",
      description: `Feedback added to ${count} submission${count !== 1 ? 's' : ''}.`,
    });
    setBulkFeedbackOpen(false);
    setBulkFeedbackText("");
    setSelectedSubmissions([]);
  };

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = ['Student', 'Assessment', 'Type', 'Course', 'Submitted', 'Status', 'Grade', 'Feedback'];
    const rows = (selectedSubmissions.length > 0 
      ? demoSubmissions.filter(s => selectedSubmissions.includes(s.id))
      : demoSubmissions
    ).map(sub => {
      const course = getCourse(sub.courseId);
      return [
        sub.studentName,
        sub.title,
        sub.type,
        course?.title || '',
        sub.submittedAt,
        statusLabels[sub.status],
        sub.grade?.toString() || '',
        sub.feedback || ''
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `submissions_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Export Complete",
      description: `${selectedSubmissions.length > 0 ? selectedSubmissions.length : demoSubmissions.length} submissions exported to CSV.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Submissions</h1>
          <p className="text-muted-foreground">Review and grade student work</p>
        </motion.div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <StatusBadge 
              status="warning" 
              label={`${pendingCount} pending ${pendingCount === 1 ? 'review' : 'reviews'}`} 
            />
          )}
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <FileDown className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-2xl font-bold">{pendingCount}</span>
          </div>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="bg-card rounded-lg border p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="text-2xl font-bold">{gradedCount}</span>
          </div>
          <p className="text-sm text-muted-foreground">Graded</p>
        </div>
        <div className="bg-card rounded-lg border p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <MessageSquare className="h-4 w-4 text-info" />
            <span className="text-2xl font-bold">{feedbackCount}</span>
          </div>
          <p className="text-sm text-muted-foreground">Feedback Given</p>
        </div>
      </div>

      {/* Search, Filter & Bulk Actions */}
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
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="graded">Graded</SelectItem>
            <SelectItem value="feedback_given">Feedback Given</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Bulk Actions */}
        {selectedSubmissions.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">
              {selectedSubmissions.length} selected
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <MoreHorizontal className="h-4 w-4" />
                  Bulk Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem onClick={handleBulkMarkReviewed}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark as Reviewed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBulkFeedbackOpen(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Feedback
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportCSV}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </motion.div>

      {/* Submissions Table */}
      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox 
                    checked={isAllSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
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
                const isSelected = selectedSubmissions.includes(submission.id);
                return (
                  <TableRow 
                    key={submission.id}
                    className={isSelected ? "bg-primary/5" : undefined}
                  >
                    <TableCell>
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={() => toggleSelection(submission.id)}
                      />
                    </TableCell>
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
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="capitalize">{submission.type}</span>
                            {submission.isManualGrading && (
                              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-[10px]">
                                Manual
                              </span>
                            )}
                          </div>
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
                        status={statusColors[submission.status]}
                        label={statusLabels[submission.status]}
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
      </div>

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
                {selectedSubmission?.type === 'essay' && 'View essay submission'}
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <Eye className="h-4 w-4 mr-2" />
                Open Full View
              </Button>
            </div>
            
            {/* Manual grading indicator */}
            {selectedSubmission?.isManualGrading && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-300">Manual Grading Required</p>
                <p className="text-amber-700 dark:text-amber-400 text-xs mt-1">
                  This submission type requires manual review and grading.
                </p>
              </div>
            )}
            
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
                    <SelectItem value="feedback_given">Feedback Given</SelectItem>
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

      {/* Bulk Feedback Dialog */}
      <Dialog open={bulkFeedbackOpen} onOpenChange={setBulkFeedbackOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add Bulk Feedback</DialogTitle>
            <DialogDescription>
              Add the same feedback to {selectedSubmissions.length} selected submission{selectedSubmissions.length !== 1 ? 's' : ''}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Feedback Message</Label>
              <Textarea 
                placeholder="Enter feedback for all selected submissions..."
                value={bulkFeedbackText}
                onChange={(e) => setBulkFeedbackText(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkFeedbackOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkAddFeedback}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
