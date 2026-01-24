import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Send, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { whatsappTemplates } from "@/lib/demo-data";

interface SendBulkMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentCount: number;
}

export function SendBulkMessageDialog({ open, onOpenChange, studentCount }: SendBulkMessageDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    template: "",
    message: "",
    sendEmail: true,
    copyForWhatsApp: false,
  });
  const [isSending, setIsSending] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    const template = whatsappTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData({
        ...formData,
        template: templateId,
        message: template.message,
      });
    }
  };

  const handleSend = async () => {
    if (!formData.message) {
      toast({
        title: "Missing Message",
        description: "Please enter a message to send.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSending(false);

    if (formData.copyForWhatsApp) {
      navigator.clipboard.writeText(formData.message);
    }

    toast({
      title: "Messages Sent",
      description: `Message sent to ${studentCount} parent${studentCount > 1 ? 's' : ''}${formData.copyForWhatsApp ? '. Also copied for WhatsApp.' : '.'}`,
    });

    setFormData({
      template: "",
      message: "",
      sendEmail: true,
      copyForWhatsApp: false,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Message to Parents</DialogTitle>
          <DialogDescription>
            Send a message to {studentCount} selected student{studentCount > 1 ? 's\'' : "'s"} parents.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Selector */}
          <div className="grid gap-2">
            <Label>Use Template (optional)</Label>
            <Select
              value={formData.template}
              onValueChange={handleTemplateSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {whatsappTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="grid gap-2">
            <Label htmlFor="bulk-message">Message *</Label>
            <Textarea
              id="bulk-message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Type your message here..."
              rows={5}
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bulk-email"
                checked={formData.sendEmail}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, sendEmail: checked as boolean })
                }
              />
              <Label htmlFor="bulk-email" className="text-sm font-normal">
                Send via Email
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bulk-whatsapp"
                checked={formData.copyForWhatsApp}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, copyForWhatsApp: checked as boolean })
                }
              />
              <Label htmlFor="bulk-whatsapp" className="text-sm font-normal">
                Copy for WhatsApp broadcast
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending} className="gap-2">
            {formData.copyForWhatsApp ? <Copy className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            {isSending ? "Sending..." : formData.copyForWhatsApp ? "Copy & Send" : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
