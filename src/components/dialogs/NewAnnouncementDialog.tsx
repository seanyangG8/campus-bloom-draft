import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { demoCohorts } from "@/lib/demo-data";

interface NewAnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewAnnouncementDialog({ open, onOpenChange }: NewAnnouncementDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    cohort: "all",
    sendEmail: true,
    sendWhatsApp: false,
  });
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!formData.title || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please enter a title and message.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSending(false);

    const channels = [];
    if (formData.sendEmail) channels.push("email");
    if (formData.sendWhatsApp) channels.push("WhatsApp");

    toast({
      title: "Announcement Sent",
      description: `Your announcement has been sent${channels.length > 0 ? ` via ${channels.join(" and ")}` : ""}.`,
    });

    setFormData({
      title: "",
      message: "",
      cohort: "all",
      sendEmail: true,
      sendWhatsApp: false,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New Announcement</DialogTitle>
          <DialogDescription>
            Send an announcement to all parents or a specific cohort.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Target Audience */}
          <div className="grid gap-2">
            <Label>Send To</Label>
            <Select
              value={formData.cohort}
              onValueChange={(value) => setFormData({ ...formData, cohort: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parents</SelectItem>
                {demoCohorts.map(cohort => (
                  <SelectItem key={cohort.id} value={cohort.id}>
                    {cohort.name} ({cohort.studentsCount} students)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Holiday Schedule Update"
            />
          </div>

          {/* Message */}
          <div className="grid gap-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Write your announcement message here..."
              rows={5}
            />
          </div>

          {/* Delivery Options */}
          <div className="space-y-3">
            <Label>Delivery Methods</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendEmail"
                checked={formData.sendEmail}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, sendEmail: checked as boolean })
                }
              />
              <Label htmlFor="sendEmail" className="text-sm font-normal">
                Send via Email
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendWhatsApp"
                checked={formData.sendWhatsApp}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, sendWhatsApp: checked as boolean })
                }
              />
              <Label htmlFor="sendWhatsApp" className="text-sm font-normal">
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
            <Send className="h-4 w-4" />
            {isSending ? "Sending..." : "Send Announcement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
