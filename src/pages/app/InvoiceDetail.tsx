import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Download, 
  Send, 
  Printer,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Separator } from "@/components/ui/separator";
import { demoInvoices, demoStudents, demoCentres } from "@/lib/demo-data";
import { useToast } from "@/hooks/use-toast";

export function InvoiceDetailPage() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Find invoice from demo data
  const invoice = demoInvoices.find(i => i.id === invoiceId) || demoInvoices[0];
  const student = demoStudents.find(s => s.id === invoice.studentId) || demoStudents[0];
  const centre = demoCentres[0];

  const handleDownload = () => {
    toast({
      title: "Downloading Invoice",
      description: `Invoice ${invoice.id} PDF is being generated.`,
    });
  };

  const handleSendReminder = () => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${student.email}.`,
    });
  };

  const handlePrint = () => {
    toast({
      title: "Printing",
      description: "Opening print dialog...",
    });
    window.print();
  };

  const handleMarkPaid = () => {
    toast({
      title: "Invoice Updated",
      description: `Invoice ${invoice.id} has been marked as paid.`,
    });
  };

  const getStatusIcon = () => {
    switch (invoice.status) {
      case 'paid':
        return <CheckCircle className="h-8 w-8 text-success" />;
      case 'pending':
        return <Clock className="h-8 w-8 text-warning" />;
      case 'overdue':
        return <AlertCircle className="h-8 w-8 text-destructive" />;
    }
  };

  // Mock line items for the invoice
  const lineItems = [
    { description: "Monthly Tuition Fee - Mathematics", quantity: 1, rate: invoice.amount * 0.6, amount: invoice.amount * 0.6 },
    { description: "Learning Materials", quantity: 1, rate: invoice.amount * 0.25, amount: invoice.amount * 0.25 },
    { description: "Platform Access Fee", quantity: 1, rate: invoice.amount * 0.15, amount: invoice.amount * 0.15 },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/app/invoices")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Invoice {invoice.id}</h1>
            <p className="text-muted-foreground">View and manage invoice details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          {invoice.status !== 'paid' && (
            <Button variant="outline" size="sm" onClick={handleSendReminder} className="gap-2">
              <Send className="h-4 w-4" />
              Send Reminder
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Document */}
      <motion.div
        className="bg-card rounded-xl border shadow-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Status Banner */}
        <div className={`p-4 flex items-center justify-between ${
          invoice.status === 'paid' ? 'bg-success/10' : 
          invoice.status === 'overdue' ? 'bg-destructive/10' : 'bg-warning/10'
        }`}>
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <p className="font-semibold capitalize">{invoice.status}</p>
              <p className="text-sm text-muted-foreground">
                {invoice.status === 'paid' ? 'Payment received' : 
                 invoice.status === 'overdue' ? 'Payment is past due' : 'Awaiting payment'}
              </p>
            </div>
          </div>
          {invoice.status !== 'paid' && (
            <Button onClick={handleMarkPaid} className="gap-2">
              <CreditCard className="h-4 w-4" />
              Mark as Paid
            </Button>
          )}
        </div>

        {/* Invoice Content */}
        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">{centre.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">123 Education Street</p>
              <p className="text-sm text-muted-foreground">Singapore 123456</p>
              <p className="text-sm text-muted-foreground">Tel: +65 1234 5678</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-foreground">INVOICE</h2>
              <p className="text-muted-foreground mt-1">{invoice.id}</p>
              <p className="text-sm text-muted-foreground mt-2">Issue Date: {invoice.dueDate}</p>
              <p className="text-sm text-muted-foreground">Due Date: {invoice.dueDate}</p>
            </div>
          </div>

          <Separator />

          {/* Bill To */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">BILL TO</p>
            <p className="font-semibold">{student.name}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Mail className="h-4 w-4" />
              {student.email}
            </div>
          </div>

          <Separator />

          {/* Line Items */}
          <div>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-medium text-muted-foreground">Description</th>
                  <th className="text-right py-2 text-sm font-medium text-muted-foreground">Qty</th>
                  <th className="text-right py-2 text-sm font-medium text-muted-foreground">Rate</th>
                  <th className="text-right py-2 text-sm font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3">{item.description}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right">${item.rate.toFixed(2)}</td>
                    <td className="py-3 text-right">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${invoice.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GST (8%)</span>
                <span>${(invoice.amount * 0.08).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${(invoice.amount * 1.08).toFixed(2)} {invoice.currency}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-muted/30 rounded-lg p-4 mt-6">
            <p className="font-medium mb-2">Payment Instructions</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Bank: DBS Bank</p>
              <p>Account Name: {centre.name}</p>
              <p>Account Number: 123-456789-0</p>
              <p>Reference: {invoice.id}</p>
            </div>
          </div>

          {/* Notes */}
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Notes</p>
            <p>Thank you for your continued trust in {centre.name}. Please ensure payment is made by the due date to avoid any service interruption.</p>
          </div>
        </div>
      </motion.div>

      {/* Related Actions */}
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => navigate(`/app/students/${student.id}`)}
        >
          View Student Profile
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => {
            toast({
              title: "Creating Duplicate",
              description: "Creating a copy of this invoice...",
            });
          }}
        >
          Duplicate Invoice
        </Button>
      </div>
    </div>
  );
}
