import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Plus, 
  Download,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
  MoreVertical,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoInvoices, Invoice } from "@/lib/demo-data";
import { StatCard } from "@/components/ui/stat-card";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { GenerateInvoicesDialog, InvoiceDetailDialog } from "@/components/dialogs";

export function InvoicesPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [generateInvoicesOpen, setGenerateInvoicesOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceDetailOpen, setInvoiceDetailOpen] = useState(false);

  const paidInvoices = demoInvoices.filter(i => i.status === 'paid');
  const pendingInvoices = demoInvoices.filter(i => i.status === 'pending');
  const overdueInvoices = demoInvoices.filter(i => i.status === 'overdue');

  const filteredInvoices = activeTab === 'all' 
    ? demoInvoices 
    : demoInvoices.filter(i => i.status === activeTab);

  const totalPaid = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPending = pendingInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = overdueInvoices.reduce((sum, i) => sum + i.amount, 0);

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "invoices_export.csv is being downloaded.",
    });
  };

  const handleRowAction = (action: string, invoice: Invoice) => {
    switch (action) {
      case "view":
        navigate(`/app/invoices/${invoice.id}`);
        break;
      case "download":
        toast({
          title: "Downloading PDF",
          description: `Invoice ${invoice.id.toUpperCase()} is being downloaded.`,
        });
        break;
      case "reminder":
        toast({
          title: "Reminder Sent",
          description: `Payment reminder sent for invoice ${invoice.id.toUpperCase()}.`,
        });
        break;
      case "paid":
        toast({
          title: "Invoice Updated",
          description: `Invoice ${invoice.id.toUpperCase()} marked as paid.`,
        });
        break;
      case "upload":
        toast({
          title: "Upload Proof",
          description: "Payment proof upload feature coming soon.",
        });
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Invoices</h1>
          <p className="text-sm text-muted-foreground">Manage billing and payments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button 
            size="sm"
            className="gap-2"
            onClick={() => setGenerateInvoicesOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Generate</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Collected"
          value={`$${totalPaid.toLocaleString()}`}
          subtitle="This month"
          icon={CreditCard}
        />
        <StatCard
          title="Paid"
          value={paidInvoices.length}
          subtitle={`$${totalPaid} total`}
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending"
          value={pendingInvoices.length}
          subtitle={`$${totalPending} outstanding`}
          icon={Clock}
        />
        <StatCard
          title="Overdue"
          value={overdueInvoices.length}
          subtitle={`$${totalOverdue} overdue`}
          icon={AlertCircle}
        />
      </div>

      {/* Filters */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm">All ({demoInvoices.length})</TabsTrigger>
            <TabsTrigger value="paid" className="text-xs sm:text-sm">Paid ({paidInvoices.length})</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm">Pending ({pendingInvoices.length})</TabsTrigger>
            <TabsTrigger value="overdue" className="text-xs sm:text-sm">Overdue ({overdueInvoices.length})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Invoices Table */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Invoice</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <InvoiceRow 
                key={invoice.id} 
                invoice={invoice} 
                onAction={handleRowAction}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <GenerateInvoicesDialog 
        open={generateInvoicesOpen} 
        onOpenChange={setGenerateInvoicesOpen} 
      />
      <InvoiceDetailDialog
        invoice={selectedInvoice}
        open={invoiceDetailOpen}
        onOpenChange={setInvoiceDetailOpen}
        onMarkAsPaid={() => {
          toast({
            title: "Invoice Updated",
            description: `Invoice marked as paid.`,
          });
        }}
      />
    </div>
  );
}

function InvoiceRow({ 
  invoice,
  onAction,
}: { 
  invoice: Invoice;
  onAction: (action: string, invoice: Invoice) => void;
}) {
  return (
    <TableRow className="hover:bg-muted/30">
      <TableCell>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">{invoice.id.toUpperCase()}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="font-medium">{invoice.studentName}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">{invoice.description}</span>
      </TableCell>
      <TableCell>
        <span className="font-semibold">
          {invoice.currency} ${invoice.amount}
        </span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{invoice.dueDate}</span>
      </TableCell>
      <TableCell>
        <StatusBadge 
          status={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'error' : 'warning'} 
          label={invoice.status}
          dot
        />
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAction("view", invoice)}>
              View Invoice
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("download", invoice)}>
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("reminder", invoice)}>
              Send Reminder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {invoice.status !== 'paid' && (
              <DropdownMenuItem onClick={() => onAction("paid", invoice)}>
                Mark as Paid
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onAction("upload", invoice)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Proof
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
