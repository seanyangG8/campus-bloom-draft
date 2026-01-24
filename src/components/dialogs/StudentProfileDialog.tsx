import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Calendar, BookOpen, Award, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Student } from "@/lib/demo-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StudentProfileDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentProfileDialog({ student, open, onOpenChange }: StudentProfileDialogProps) {
  const { toast } = useToast();

  if (!student) return null;

  const handleMessageParent = () => {
    toast({
      title: "Message Copied",
      description: "Message template copied to clipboard for WhatsApp.",
    });
    navigator.clipboard.writeText(
      `Hi, this is regarding ${student.name}'s progress at our centre...`
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Student Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-semibold text-primary">
                {student.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">{student.name}</h3>
                <StatusBadge 
                  status={student.status === 'active' ? 'success' : student.status === 'at-risk' ? 'warning' : 'neutral'} 
                  label={student.status}
                  dot
                />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {student.email}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {student.phone}
                </div>
              </div>
            </div>
            <ProgressRing progress={student.completionRate} size={56} strokeWidth={4} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <BookOpen className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-semibold">{student.enrolledCourses}</p>
              <p className="text-xs text-muted-foreground">Courses</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-accent" />
              <p className="text-lg font-semibold">{student.lastActive}</p>
              <p className="text-xs text-muted-foreground">Last Active</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <Award className="h-5 w-5 mx-auto mb-1 text-info" />
              <p className="text-lg font-semibold">{student.makeUpCredits}</p>
              <p className="text-xs text-muted-foreground">Make-up Credits</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="courses">
            <TabsList className="w-full">
              <TabsTrigger value="courses" className="flex-1">Courses</TabsTrigger>
              <TabsTrigger value="attendance" className="flex-1">Attendance</TabsTrigger>
              <TabsTrigger value="invoices" className="flex-1">Invoices</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="mt-4 space-y-2">
              <div className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Sec 3 Mathematics</p>
                  <p className="text-xs text-muted-foreground">Chapter 5 of 8</p>
                </div>
                <ProgressRing progress={65} size={32} strokeWidth={3} />
              </div>
              <div className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">O-Level English</p>
                  <p className="text-xs text-muted-foreground">Chapter 3 of 6</p>
                </div>
                <ProgressRing progress={50} size={32} strokeWidth={3} />
              </div>
            </TabsContent>

            <TabsContent value="attendance" className="mt-4">
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">92% attendance rate</p>
                <p className="text-xs">Last 30 days</p>
              </div>
            </TabsContent>

            <TabsContent value="invoices" className="mt-4 space-y-2">
              <div className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">January 2024</p>
                  <p className="text-xs text-muted-foreground">$350</p>
                </div>
                <StatusBadge status="success" label="paid" />
              </div>
              <div className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">February 2024</p>
                  <p className="text-xs text-muted-foreground">$350</p>
                </div>
                <StatusBadge status="warning" label="pending" />
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="outline" className="flex-1 gap-2" onClick={handleMessageParent}>
              <MessageSquare className="h-4 w-4" />
              Message Parent
            </Button>
            <Button variant="outline" className="flex-1">
              Edit Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
