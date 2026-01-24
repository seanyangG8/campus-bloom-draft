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
import { Textarea } from "@/components/ui/textarea";
import { Student } from "@/lib/demo-data";

interface AddMakeUpCreditDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMakeUpCreditDialog({ student, open, onOpenChange }: AddMakeUpCreditDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    credits: "1",
    reason: "",
  });

  const handleAdd = () => {
    if (!formData.credits || parseInt(formData.credits) < 1) {
      toast({
        title: "Invalid Credits",
        description: "Please enter at least 1 credit.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Credits Added",
      description: `${formData.credits} make-up credit${parseInt(formData.credits) > 1 ? 's' : ''} added to ${student?.name}.`,
    });

    setFormData({ credits: "1", reason: "" });
    onOpenChange(false);
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Make-up Credit</DialogTitle>
          <DialogDescription>
            Add make-up session credits for {student.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            Current credits: <span className="font-semibold">{student.makeUpCredits}</span>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="credits">Credits to Add *</Label>
            <Input
              id="credits"
              type="number"
              min="1"
              max="10"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="e.g., Missed class due to illness"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add Credits</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
