import { useState } from "react";
import { AlertTriangle, MessageSquare, Copy, Check } from "lucide-react";
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
import { Session } from "@/lib/demo-data";

interface CancelSessionDialogProps {
  session: Session | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const cancelReasons = [
  { value: "tutor_unavailable", label: "Tutor unavailable" },
  { value: "low_attendance", label: "Low expected attendance" },
  { value: "public_holiday", label: "Public holiday" },
  { value: "emergency", label: "Emergency" },
  { value: "other", label: "Other" },
];

export function CancelSessionDialog({ 
  session, 
  open, 
  onOpenChange 
}: CancelSessionDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    reason: "",
    notes: "",
    offerMakeUp: true,
  });
  const [showWhatsAppTemplate, setShowWhatsAppTemplate] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCancel = () => {
    if (!formData.reason) {
      toast({
        title: "Reason Required",
        description: "Please select a reason for cancellation.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Session Cancelled",
      description: formData.offerMakeUp 
        ? "Session cancelled. Make-up credits have been added to affected students."
        : "Session cancelled.",
    });

    setShowWhatsAppTemplate(true);
  };

  const whatsAppMessage = session ? `Hi! This is a notification from Bright Minds Academy.

Unfortunately, the session "${session.title}" scheduled for ${session.date} at ${session.time} has been cancelled.

Reason: ${cancelReasons.find(r => r.value === formData.reason)?.label || formData.reason}
${formData.notes ? `\nNote: ${formData.notes}` : ""}
${formData.offerMakeUp ? "\n✅ A make-up credit has been added to your account. You can use this to book a replacement session." : ""}

We apologize for any inconvenience. Please contact us if you have any questions.

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
    setFormData({ reason: "", notes: "", offerMakeUp: true });
    setShowWhatsAppTemplate(false);
    setCopied(false);
    onOpenChange(false);
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Cancel Session
          </DialogTitle>
          <DialogDescription>
            {showWhatsAppTemplate 
              ? "Session cancelled. Copy the message below to notify students."
              : `Cancel "${session.title}" on ${session.date}.`
            }
          </DialogDescription>
        </DialogHeader>

        {!showWhatsAppTemplate ? (
          <>
            <div className="space-y-4 py-2">
              {/* Warning */}
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm">
                <p className="text-destructive font-medium">This action cannot be undone.</p>
                <p className="text-muted-foreground mt-1">
                  {session.totalStudents} student{session.totalStudents !== 1 ? 's' : ''} will be affected.
                </p>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label>Reason *</Label>
                <Select
                  value={formData.reason}
                  onValueChange={(v) => setFormData({ ...formData, reason: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {cancelReasons.map((reason) => (
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

              {/* Make-up Credit Option */}
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Checkbox
                  id="offerMakeUp"
                  checked={formData.offerMakeUp}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, offerMakeUp: checked as boolean })
                  }
                />
                <div className="grid gap-1">
                  <Label htmlFor="offerMakeUp" className="cursor-pointer font-medium">
                    Offer make-up credits
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Add 1 make-up credit to each affected student's account
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Keep Session
              </Button>
              <Button variant="destructive" onClick={handleCancel}>
                Cancel Session
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
              
              <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap font-mono max-h-[250px] overflow-y-auto">
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
