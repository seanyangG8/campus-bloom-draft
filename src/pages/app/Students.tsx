import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter,
  Download,
  Upload,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { RoleBadge } from "@/components/ui/role-badge";
import { demoStudents, Student } from "@/lib/demo-data";
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
import { Checkbox } from "@/components/ui/checkbox";

export function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const filteredStudents = demoStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const toggleStudent = (id: string) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage student enrolments and progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button className="gradient-hero text-primary-foreground gap-2">
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedStudents.length > 0 && (
        <motion.div 
          className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-sm font-medium">
            {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Send Message</Button>
            <Button variant="outline" size="sm">Generate Invoices</Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedStudents([])}>
              Clear
            </Button>
          </div>
        </motion.div>
      )}

      {/* Students Table */}
      <motion.div
        className="bg-card rounded-xl border shadow-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Make-ups</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <StudentRow
                key={student.id}
                student={student}
                isSelected={selectedStudents.includes(student.id)}
                onToggle={() => toggleStudent(student.id)}
              />
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}

function StudentRow({ 
  student, 
  isSelected, 
  onToggle 
}: { 
  student: Student; 
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <TableRow className="hover:bg-muted/30">
      <TableCell>
        <Checkbox checked={isSelected} onCheckedChange={onToggle} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {student.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-medium">{student.name}</p>
            <p className="text-xs text-muted-foreground">{student.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-3 w-3" />
          {student.phone}
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm">{student.enrolledCourses} courses</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <ProgressRing progress={student.completionRate} size={28} strokeWidth={3} />
          <span className="text-sm">{student.completionRate}%</span>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge 
          status={student.status === 'active' ? 'success' : student.status === 'at-risk' ? 'warning' : 'neutral'} 
          label={student.status}
          dot
        />
      </TableCell>
      <TableCell>
        {student.makeUpCredits > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-info/10 text-info text-xs font-medium">
            {student.makeUpCredits} credits
          </span>
        )}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Edit Details</DropdownMenuItem>
            <DropdownMenuItem>Message Parent</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Generate Invoice</DropdownMenuItem>
            <DropdownMenuItem>Add Make-up Credit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
