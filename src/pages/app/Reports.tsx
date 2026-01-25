import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  BookOpen,
  Calendar,
  Download,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const enrollmentData = [
  { month: "Aug", students: 45 },
  { month: "Sep", students: 52 },
  { month: "Oct", students: 58 },
  { month: "Nov", students: 65 },
  { month: "Dec", students: 62 },
  { month: "Jan", students: 74 },
];

const revenueData = [
  { month: "Aug", revenue: 18500 },
  { month: "Sep", revenue: 21200 },
  { month: "Oct", revenue: 24800 },
  { month: "Nov", revenue: 27500 },
  { month: "Dec", revenue: 26200 },
  { month: "Jan", revenue: 31400 },
];

const attendanceData = [
  { day: "Mon", rate: 92 },
  { day: "Tue", rate: 88 },
  { day: "Wed", rate: 95 },
  { day: "Thu", rate: 90 },
  { day: "Fri", rate: 85 },
  { day: "Sat", rate: 97 },
];

const subjectDistribution = [
  { name: "Mathematics", value: 35, color: "hsl(var(--primary))" },
  { name: "Science", value: 28, color: "hsl(var(--accent))" },
  { name: "English", value: 22, color: "hsl(var(--chart-3))" },
  { name: "Economics", value: 15, color: "hsl(var(--chart-4))" },
];

export function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Track performance and insights</p>
        </motion.div>
        <div className="flex items-center gap-2">
          <Select defaultValue="jan2024">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="jan2024">January 2024</SelectItem>
              <SelectItem value="q4-2023">Q4 2023</SelectItem>
              <SelectItem value="2023">Full Year 2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value="74"
          icon={Users}
          trend={{ value: 12, label: "vs last month", positive: true }}
        />
        <StatCard
          title="Monthly Revenue"
          value="$31,400"
          icon={DollarSign}
          trend={{ value: 8, label: "vs last month", positive: true }}
        />
        <StatCard
          title="Active Courses"
          value="12"
          icon={BookOpen}
          trend={{ value: 2, label: "new this month", positive: true }}
        />
        <StatCard
          title="Avg Attendance"
          value="91%"
          icon={Calendar}
          trend={{ value: 3, label: "vs last week", positive: true }}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Student Enrollment</h3>
              <p className="text-sm text-muted-foreground">Last 6 months</p>
            </div>
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="students" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Revenue Trend</h3>
              <p className="text-sm text-muted-foreground">Last 6 months</p>
            </div>
            <DollarSign className="h-5 w-5 text-accent" />
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="hsl(var(--accent))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Weekly Attendance</h3>
              <p className="text-sm text-muted-foreground">This week</p>
            </div>
            <Calendar className="h-5 w-5 text-accent" />
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value}%`, 'Attendance']}
                />
                <Bar 
                  dataKey="rate" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Subject Distribution</h3>
              <p className="text-sm text-muted-foreground">By enrollment</p>
            </div>
            <BookOpen className="h-5 w-5 text-accent" />
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value}%`, 'Students']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}