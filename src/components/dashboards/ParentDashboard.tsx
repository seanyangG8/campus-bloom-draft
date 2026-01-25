import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  CreditCard,
  BarChart3,
  Download,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoStudents, demoInvoices, demoSessions } from "@/lib/demo-data";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ParentDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const children = [demoStudents[0]]; // Mock linked children
  const selectedChild = children[0];
  const childInvoices = demoInvoices.filter(i => i.studentId === 'stu-1');
  const unpaidInvoices = childInvoices.filter(i => i.status !== 'paid');
  const upcomingSessions = demoSessions.filter(s => s.status === 'scheduled').slice(0, 2);

  const handleDownloadReport = () => {
    toast({
      title: "Downloading Report",
      description: `Progress report for ${selectedChild.name} is being generated.`,
    });
  };

  const handlePayNow = (invoice: typeof demoInvoices[0]) => {
    navigate(`/app/invoices/${invoice.id}`);
  };

  const handleViewTimetable = () => {
    navigate('/app/timetable');
  };

  return (
    <div className="space-y-6">
      {/* Header with Child Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Parent Portal</h1>
          <p className="text-sm text-muted-foreground">Track your child's learning progress</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="h-3 w-3" />
              {selectedChild.name}
              <ChevronDown className="h-3 w-3" />
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Course Progress"
          value={`${selectedChild.completionRate}%`}
          subtitle="Overall completion"
          icon={BarChart3}
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
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Snapshot */}
        <div className="bg-card rounded-lg border">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-sm font-medium">Progress Snapshot</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 text-xs"
              onClick={handleDownloadReport}
            >
              <Download className="h-3 w-3" />
              Download Report
            </Button>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-6 mb-6">
              <ProgressRing progress={selectedChild.completionRate} size={64} strokeWidth={4} />
              <div>
                <p className="text-xs text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-semibold">{selectedChild.completionRate}%</p>
                <p className="text-xs text-success">+5% from last week</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sec 3 Mathematics</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-foreground rounded-full" />
                  </div>
                  <span className="text-xs text-muted-foreground">75%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">O-Level English</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-foreground rounded-full" />
                  </div>
                  <span className="text-xs text-muted-foreground">50%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-card rounded-lg border">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-sm font-medium">Upcoming Classes</h2>
            <Button variant="ghost" size="sm" className="text-xs" onClick={handleViewTimetable}>View All</Button>
          </div>
          <div className="p-4 space-y-2">
            {upcomingSessions.map((session) => (
              <div 
                key={session.id} 
                className="p-3 rounded-md cursor-pointer hover:bg-muted transition-colors"
                onClick={handleViewTimetable}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{session.title}</p>
                  <StatusBadge status="info" label={session.date} />
                </div>
                <p className="text-xs text-muted-foreground">{session.time} • {session.duration} mins</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-sm font-medium">Invoices</h2>
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/app/invoices')}>View All</Button>
        </div>
        <div className="p-4 space-y-2">
          {childInvoices.map((invoice) => (
            <div 
              key={invoice.id}
              className="flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-muted transition-colors"
              onClick={() => navigate(`/app/invoices/${invoice.id}`)}
            >
              <div>
                <p className="font-medium text-sm">{invoice.description}</p>
                <p className="text-xs text-muted-foreground">Due: {invoice.dueDate}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-medium">${invoice.amount}</p>
                  <StatusBadge 
                    status={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'error' : 'warning'} 
                    label={invoice.status}
                  />
                </div>
                {invoice.status !== 'paid' && (
                  <Button 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePayNow(invoice);
                    }}
                  >
                    Pay Now
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
