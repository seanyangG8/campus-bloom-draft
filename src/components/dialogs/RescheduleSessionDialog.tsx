import { useState } from "react";
import { Calendar, Clock, MessageSquare, Copy, Check } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Session } from "@/lib/demo-data";

interface RescheduleSessionDialogProps {
  session: Session | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const rescheduleReasons = [
  { value: "tutor_unavailable", label: "Tutor unavailable" },
  { value: "public_holiday", label: "Public holiday" },
  { value: "student_request", label: "Student/parent request" },
  { value: "venue_issue", label: "Venue/technical issue" },
  { value: "other", label: "Other" },
];

export function RescheduleSessionDialog({ 
  session, 
  open, 
  onOpenChange 
}: RescheduleSessionDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    newDate: "",
    newTime: "",
    reason: "",
    notes: "",
  });
  const [showWhatsAppTemplate, setShowWhatsAppTemplate] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReschedule = () => {
    if (!formData.newDate || !formData.newTime) {
      toast({
        title: "Missing Information",
        description: "Please select a new date and time.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Session Rescheduled",
      description: `Session moved to ${formData.newDate} at ${formData.newTime}.`,
    });

    setShowWhatsAppTemplate(true);
  };

  const whatsAppMessage = session ? `Hi! This is a notification from Bright Minds Academy.

The session "${session.title}" originally scheduled for ${session.date} at ${session.time} has been rescheduled.

📅 New Date: ${formData.newDate || "[New Date]"}
🕐 New Time: ${formData.newTime || "[New Time]"}
${formData.reason ? `\nReason: ${rescheduleReasons.find(r => r.value === formData.reason)?.label || formData.reason}` : ""}

The meeting link remains the same: ${session.meetingLink}

Thank you for your understanding!` : "";

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(whatsAppMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "WhatsApp message copied to clipboard.",
    });
  };

  const handleClose = () => {
    setFormData({ newDate: "", newTime: "", reason: "", notes: "" });
    setShowWhatsAppTemplate(false);
    setCopied(false);
    onOpenChange(false);
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reschedule Session</DialogTitle>
          <DialogDescription>
            {showWhatsAppTemplate 
              ? "Session rescheduled! Copy the message below to notify students."
              : `Move "${session.title}" to a new date and time.`
            }
          </DialogDescription>
        </DialogHeader>

        {!showWhatsAppTemplate ? (
          <>
            <div className="space-y-4 py-2">
              {/* Current Schedule */}
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="text-muted-foreground mb-1">Current schedule:</p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {session.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {session.time}
                  </span>
                </div>
              </div>

              {/* New Date/Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newDate">New Date *</Label>
                  <Input
                    id="newDate"
                    type="date"
                    value={formData.newDate}
                    onChange={(e) => setFormData({ ...formData, newDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newTime">New Time *</Label>
                  <Input
                    id="newTime"
                    type="time"
                    value={formData.newTime}
                    onChange={(e) => setFormData({ ...formData, newTime: e.target.value })}
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label>Reason (optional)</Label>
                <Select
                  value={formData.reason}
                  onValueChange={(v) => setFormData({ ...formData, reason: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {rescheduleReasons.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional details..."
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleReschedule}>
                Reschedule Session
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp notification template</span>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap font-mono">
                {whatsAppMessage}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Done
              </Button>
              <Button onClick={handleCopyWhatsApp} className="gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy for WhatsApp"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
