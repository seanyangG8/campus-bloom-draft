import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Calendar, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { demoCourses, demoStudents } from "@/lib/demo-data";

interface GenerateInvoicesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStudentIds?: string[];
}

export function GenerateInvoicesDialog({ 
  open, 
  onOpenChange, 
  selectedStudentIds = [] 
}: GenerateInvoicesDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    course: "",
    amount: "350",
    description: "Monthly Tuition Fee",
    dueDate: "",
    sendEmail: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const targetStudents = selectedStudentIds.length > 0 
    ? demoStudents.filter(s => selectedStudentIds.includes(s.id))
    : demoStudents;

  const handleGenerate = async () => {
    if (!formData.amount || !formData.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in the amount and due date.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(false);

    toast({
      title: "Invoices Generated",
      description: `${targetStudents.length} invoices have been created${formData.sendEmail ? " and emailed to parents" : ""}.`,
    });

    onOpenChange(false);
  };

  // Default due date to 2 weeks from now
  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Invoices</DialogTitle>
          <DialogDescription>
            Create invoices for {selectedStudentIds.length > 0 
              ? `${selectedStudentIds.length} selected student${selectedStudentIds.length > 1 ? 's' : ''}`
              : 'all students'
            }.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Course Filter */}
          <div className="grid gap-2">
            <Label>For Course (optional)</Label>
            <Select
              value={formData.course}
              onValueChange={(value) => setFormData({ ...formData, course: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {demoCourses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (SGD) *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="pl-9"
                placeholder="350"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Monthly Tuition Fee - January 2024"
            />
          </div>

          {/* Due Date */}
          <div className="grid gap-2">
            <Label htmlFor="dueDate">Due Date *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate || getDefaultDueDate()}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="pl-9"
              />
            </div>
          </div>

          {/* Send Email */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendEmail"
              checked={formData.sendEmail}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, sendEmail: checked as boolean })
              }
            />
            <Label htmlFor="sendEmail" className="text-sm font-normal">
              Send invoice email to parents
            </Label>
          </div>

          {/* Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Summary</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• {targetStudents.length} invoice{targetStudents.length > 1 ? 's' : ''} will be generated</p>
              <p>• Total amount: ${(parseFloat(formData.amount || "0") * targetStudents.length).toFixed(2)}</p>
              {formData.sendEmail && <p>• Email notifications will be sent</p>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Invoices"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
