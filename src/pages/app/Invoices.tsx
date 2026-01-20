import { useState } from "react";
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

export function InvoicesPage() {
  const [activeTab, setActiveTab] = useState("all");

  const paidInvoices = demoInvoices.filter(i => i.status === 'paid');
  const pendingInvoices = demoInvoices.filter(i => i.status === 'pending');
  const overdueInvoices = demoInvoices.filter(i => i.status === 'overdue');

  const filteredInvoices = activeTab === 'all' 
    ? demoInvoices 
    : demoInvoices.filter(i => i.status === activeTab);

  const totalPaid = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPending = pendingInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = overdueInvoices.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground">Manage billing and payments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gradient-hero text-primary-foreground gap-2">
            <Plus className="h-4 w-4" />
            Generate Invoices
          </Button>
        </div>
      </div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <StatCard
          title="Total Collected"
          value={`$${totalPaid.toLocaleString()}`}
          subtitle="This month"
          icon={CreditCard}
          variant="accent"
        />
        <StatCard
          title="Paid"
          value={paidInvoices.length}
          subtitle={`$${totalPaid} total`}
          icon={CheckCircle2}
          variant="success"
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
          variant="warning"
        />
      </motion.div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({demoInvoices.length})</TabsTrigger>
            <TabsTrigger value="paid">Paid ({paidInvoices.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingInvoices.length})</TabsTrigger>
            <TabsTrigger value="overdue">Overdue ({overdueInvoices.length})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Invoices Table */}
      <motion.div
        className="bg-card rounded-xl border shadow-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
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
              <InvoiceRow key={invoice.id} invoice={invoice} />
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
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
            <DropdownMenuItem>View Invoice</DropdownMenuItem>
            <DropdownMenuItem>Download PDF</DropdownMenuItem>
            <DropdownMenuItem>Send Reminder</DropdownMenuItem>
            <DropdownMenuSeparator />
            {invoice.status !== 'paid' && (
              <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Upload className="mr-2 h-4 w-4" />
              Upload Proof
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
