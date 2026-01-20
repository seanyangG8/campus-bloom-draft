import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  CreditCard,
  BarChart3,
  AlertTriangle,
  Download,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoStudents, demoInvoices, demoSessions } from "@/lib/demo-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ParentDashboard() {
  const children = [demoStudents[0]]; // Mock linked children
  const selectedChild = children[0];
  const childInvoices = demoInvoices.filter(i => i.studentId === 'stu-1');
  const unpaidInvoices = childInvoices.filter(i => i.status !== 'paid');
  const upcomingSessions = demoSessions.filter(s => s.status === 'scheduled').slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Header with Child Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Parent Portal</h1>
          <p className="text-muted-foreground">Track your child's learning progress</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              {selectedChild.name}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {children.map((child) => (
              <DropdownMenuItem key={child.id}>
                {child.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <StatCard
          title="Course Progress"
          value={`${selectedChild.completionRate}%`}
          subtitle="Overall completion"
          icon={BarChart3}
          variant="accent"
        />
        <StatCard
          title="Attendance Rate"
          value="92%"
          subtitle="Last 30 days"
          icon={Calendar}
        />
        <StatCard
          title="Unpaid Invoices"
          value={unpaidInvoices.length}
          subtitle={`$${unpaidInvoices.reduce((sum, i) => sum + i.amount, 0)} total`}
          icon={CreditCard}
          variant={unpaidInvoices.length > 0 ? 'warning' : 'default'}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Snapshot */}
        <motion.div
          className="bg-card rounded-xl border shadow-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">Progress Snapshot</h2>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-6 mb-6">
              <ProgressRing progress={selectedChild.completionRate} size={80} strokeWidth={6} />
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-3xl font-bold">{selectedChild.completionRate}%</p>
                <p className="text-xs text-success">+5% from last week</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sec 3 Mathematics</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-accent rounded-full" />
                  </div>
                  <span className="text-xs text-muted-foreground">75%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">O-Level English</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-accent rounded-full" />
                  </div>
                  <span className="text-xs text-muted-foreground">50%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          className="bg-card rounded-xl border shadow-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="p-4 border-b">
            <h2 className="font-semibold">Upcoming Classes</h2>
          </div>
          <div className="p-4 space-y-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{session.title}</p>
                  <StatusBadge status="info" label={session.date} />
                </div>
                <p className="text-xs text-muted-foreground">{session.time} • {session.duration} mins</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Invoices */}
      <motion.div
        className="bg-card rounded-xl border shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Invoices</h2>
        </div>
        <div className="p-4 space-y-3">
          {childInvoices.map((invoice) => (
            <div 
              key={invoice.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div>
                <p className="font-medium text-sm">{invoice.description}</p>
                <p className="text-xs text-muted-foreground">Due: {invoice.dueDate}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-semibold">${invoice.amount}</p>
                  <StatusBadge 
                    status={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'error' : 'warning'} 
                    label={invoice.status}
                  />
                </div>
                {invoice.status !== 'paid' && (
                  <Button size="sm">Pay Now</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
