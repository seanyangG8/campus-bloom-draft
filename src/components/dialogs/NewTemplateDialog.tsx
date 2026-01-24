import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Info } from "lucide-react";
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

interface NewTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewTemplateDialog({ open, onOpenChange }: NewTemplateDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });

  const handleSave = () => {
    if (!formData.name || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please enter a name and message template.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Template Saved",
      description: `"${formData.name}" has been added to your templates.`,
    });

    setFormData({ name: "", message: "" });
    onOpenChange(false);
  };

  const insertVariable = (variable: string) => {
    setFormData({
      ...formData,
      message: formData.message + `{${variable}}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create WhatsApp Template</DialogTitle>
          <DialogDescription>
            Create a reusable message template for quick WhatsApp communication.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Template Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Payment Reminder"
            />
          </div>

          {/* Message Template */}
          <div className="grid gap-2">
            <Label htmlFor="message">Message Template *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Hi {parent_name}, this is a reminder that..."
              rows={6}
            />
          </div>

          {/* Variables */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Available Variables</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {["parent_name", "student_name", "date", "time", "amount", "course_name", "centre_name"].map((variable) => (
                <Button
                  key={variable}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs font-mono"
                  onClick={() => insertVariable(variable)}
                >
                  {`{${variable}}`}
                </Button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {formData.message && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="bg-[#dcf8c6] rounded-lg p-3 text-sm">
                {formData.message
                  .replace("{parent_name}", "Mrs. Tan")
                  .replace("{student_name}", "Wei Lin")
                  .replace("{date}", "25 Jan 2024")
                  .replace("{time}", "4:00 PM")
                  .replace("{amount}", "$350")
                  .replace("{course_name}", "Sec 3 Mathematics")
                  .replace("{centre_name}", "Bright Minds")}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
