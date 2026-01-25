import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen,
  Clock,
  CreditCard,
  MessageSquare,
  Edit,
  Plus,
  Download,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { demoStudents, demoInvoices, demoCourses, demoSessions } from "@/lib/demo-data";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { EditStudentDialog, AddMakeUpCreditDialog } from "@/components/dialogs";

export function StudentProfilePage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [makeUpCreditDialogOpen, setMakeUpCreditDialogOpen] = useState(false);

  // Find student from demo data
  const student = demoStudents.find(s => s.id === studentId) || demoStudents[0];
  const studentInvoices = demoInvoices.filter(i => i.studentId === student.id);
  const enrolledCourses = demoCourses.slice(0, student.enrolledCourses);
  const attendanceHistory = demoSessions.slice(0, 5);

  const handleSendMessage = () => {
    toast({
      title: "Opening Message",
      description: `Starting conversation with ${student.name}...`,
    });
    navigate("/app/messages");
  };

  const handleDownloadReport = () => {
    toast({
      title: "Downloading Report",
      description: `Progress report for ${student.name} is being generated.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/app/students")} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Student Profile</h1>
      </div>

      {/* Profile Card */}
      <motion.div
        className="bg-card rounded-xl border shadow-card p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar & Basic Info */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 shrink-0">
              <AvatarImage src={student.avatar} />
              <AvatarFallback className="text-lg sm:text-xl">{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-semibold truncate">{student.name}</h2>
                <StatusBadge 
                  status={student.status === 'active' ? 'success' : student.status === 'at-risk' ? 'warning' : 'neutral'} 
                  label={student.status} 
                />
              </div>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>Last active: {student.lastActive}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 lg:ml-auto">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <ProgressRing progress={student.completionRate} size={40} strokeWidth={4} />
              <p className="text-xs text-muted-foreground mt-1">Completion</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{student.enrolledCourses}</p>
              <p className="text-xs text-muted-foreground">Courses</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{student.makeUpCredits}</p>
              <p className="text-xs text-muted-foreground">Make-ups</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-foreground">92%</p>
              <p className="text-xs text-muted-foreground">Attendance</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
          <Button onClick={() => setEditDialogOpen(true)} variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button onClick={handleSendMessage} variant="outline" size="sm" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Message</span>
          </Button>
          <Button onClick={() => setMakeUpCreditDialogOpen(true)} variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Make-up</span>
          </Button>
          <Button onClick={handleDownloadReport} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Report</span>
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="w-full sm:w-auto flex overflow-x-auto">
          <TabsTrigger value="courses" className="gap-2 flex-1 sm:flex-none">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Courses</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2 flex-1 sm:flex-none">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Attendance</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2 flex-1 sm:flex-none">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <motion.div
            className="bg-card rounded-xl border shadow-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrolledCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-xs text-muted-foreground">{course.subject}</p>
                      </div>
                    </TableCell>
                    <TableCell>{course.level}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent rounded-full" 
                            style={{ width: `${course.completionRate}%` }}
                          />
                        </div>
                        <span className="text-xs">{course.completionRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status="success" label={course.status} />
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/app/courses/${course.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        <TabsContent value="attendance">
          <motion.div
            className="bg-card rounded-xl border shadow-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceHistory.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.title}</TableCell>
                    <TableCell>{session.date}</TableCell>
                    <TableCell>{session.time}</TableCell>
                    <TableCell>
                      <StatusBadge 
                        status={session.status === 'completed' ? 'success' : session.status === 'scheduled' ? 'info' : 'neutral'} 
                        label={session.status === 'completed' ? 'Attended' : session.status} 
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem onClick={() => toast({ title: "Viewing recording..." })}>
                            View Recording
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast({ title: "Marking as absent..." })}>
                            Mark Absent
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>

        <TabsContent value="billing">
          <motion.div
            className="bg-card rounded-xl border shadow-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>${invoice.amount}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>
                      <StatusBadge 
                        status={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'error' : 'warning'} 
                        label={invoice.status} 
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/app/invoices/${invoice.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <EditStudentDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        student={student}
      />
      <AddMakeUpCreditDialog
        open={makeUpCreditDialogOpen}
        onOpenChange={setMakeUpCreditDialogOpen}
        student={student}
      />
    </div>
  );
}
