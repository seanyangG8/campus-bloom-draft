import { useToast } from "@/hooks/use-toast";
import { Download, Send, CheckCircle2, FileText, Calendar, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Invoice } from "@/lib/demo-data";
import { Separator } from "@/components/ui/separator";

interface InvoiceDetailDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkAsPaid?: () => void;
}

export function InvoiceDetailDialog({ invoice, open, onOpenChange, onMarkAsPaid }: InvoiceDetailDialogProps) {
  const { toast } = useToast();

  if (!invoice) return null;

  const handleDownload = () => {
    toast({
      title: "Downloading PDF",
      description: `Invoice ${invoice.id.toUpperCase()} is being downloaded.`,
    });
  };

  const handleSendReminder = () => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent for invoice ${invoice.id.toUpperCase()}.`,
    });
  };

  const handleMarkAsPaid = () => {
    toast({
      title: "Invoice Updated",
      description: `Invoice ${invoice.id.toUpperCase()} marked as paid.`,
    });
    onMarkAsPaid?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoice {invoice.id.toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded-lg ${
            invoice.status === 'paid' 
              ? 'bg-success/10 border border-success/20' 
              : invoice.status === 'overdue'
              ? 'bg-destructive/10 border border-destructive/20'
              : 'bg-warning/10 border border-warning/20'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <StatusBadge 
                  status={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'error' : 'warning'} 
                  label={invoice.status}
                  dot
                />
              </div>
              <p className="text-2xl font-bold">
                {invoice.currency} ${invoice.amount}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {invoice.studentName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-medium">{invoice.studentName}</p>
                <p className="text-sm text-muted-foreground">Student</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="font-medium">{invoice.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{invoice.dueDate}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Details (mock) */}
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Details
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Bank: DBS Bank</p>
                <p>Account: 123-456789-0</p>
                <p>PayNow: 91234567</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            {invoice.status !== 'paid' && (
              <>
                <Button variant="outline" className="gap-2" onClick={handleSendReminder}>
                  <Send className="h-4 w-4" />
                  Send Reminder
                </Button>
                <Button className="gap-2 ml-auto" onClick={handleMarkAsPaid}>
                  <CheckCircle2 className="h-4 w-4" />
                  Mark as Paid
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
