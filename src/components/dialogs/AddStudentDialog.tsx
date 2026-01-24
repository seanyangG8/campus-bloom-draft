import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddStudentDialog({ open, onOpenChange }: AddStudentDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    course: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Mock save action
    toast({
      title: "Student Added",
      description: `${formData.name} has been added successfully.`,
    });

    // Reset form and close
    setFormData({
      name: "",
      email: "",
      phone: "",
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      course: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enter the student's details below. Parent information is optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Student Information</h4>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., John Tan Wei Ming"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@email.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+65 9123 4567"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="course">Enroll in Course</Label>
              <Select
                value={formData.course}
                onValueChange={(value) => setFormData({ ...formData, course: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math-sec3">Sec 3 Mathematics</SelectItem>
                  <SelectItem value="english-olevel">O-Level English</SelectItem>
                  <SelectItem value="science-sec2">Sec 2 Science</SelectItem>
                  <SelectItem value="chinese-sec4">Sec 4 Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground">Parent/Guardian Information</h4>
            
            <div className="grid gap-2">
              <Label htmlFor="parentName">Parent Name</Label>
              <Input
                id="parentName"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="e.g., Mrs. Tan Mei Ling"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="parentEmail">Parent Email</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                  placeholder="parent@email.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parentPhone">Parent Phone</Label>
                <Input
                  id="parentPhone"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  placeholder="+65 9876 5432"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Student</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
