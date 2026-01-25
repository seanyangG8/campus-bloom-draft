import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Users, 
  Calendar,
  BookOpen,
  MoreHorizontal,
  UserPlus,
  Edit,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { demoCohorts, demoCourses, Cohort } from "@/lib/demo-data";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

export function CohortsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentRole } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const [manageStudentsOpen, setManageStudentsOpen] = useState(false);

  const filteredCohorts = demoCohorts.filter((cohort) =>
    cohort.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCourse = (courseId: string) => {
    return demoCourses.find((c) => c.id === courseId);
  };

  const handleCreateCohort = () => {
    toast({
      title: "Cohort Created",
      description: "New cohort has been created successfully.",
    });
    setCreateDialogOpen(false);
  };

  const handleDeleteCohort = (cohort: Cohort) => {
    toast({
      title: "Cohort Deleted",
      description: `${cohort.name} has been removed.`,
    });
  };

  const handleManageStudents = (cohort: Cohort) => {
    setSelectedCohort(cohort);
    setManageStudentsOpen(true);
  };

  const isAdmin = currentRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl font-bold text-foreground">Cohorts</h1>
          <p className="text-muted-foreground">Manage student groups and class schedules</p>
        </motion.div>
        {isAdmin && (
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            New Cohort
          </Button>
        )}
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cohorts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Cohorts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCohorts.map((cohort) => {
          const course = getCourse(cohort.courseId);
          return (
            <div
              key={cohort.id}
              className="bg-card rounded-lg border border-border/50 p-5 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate">{cohort.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {course?.title || "Unknown Course"}
                  </p>
                </div>
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem onClick={() => handleManageStudents(cohort)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Manage Students
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Cohort
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteCohort(cohort)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Cohort
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 shrink-0" />
                  <span>{cohort.studentsCount} {cohort.studentsCount === 1 ? 'student' : 'students'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span className="truncate">{cohort.schedule}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <StatusBadge
                  status={
                    cohort.status === 'active' ? 'success' :
                    cohort.status === 'upcoming' ? 'info' : 'neutral'
                  }
                  label={cohort.status}
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/app/timetable')}
                >
                  View Schedule
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCohorts.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg">No cohorts found</h3>
          <p className="text-muted-foreground">Try adjusting your search or create a new cohort.</p>
        </div>
      )}

      {/* Create Cohort Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Create New Cohort</DialogTitle>
            <DialogDescription>
              Set up a new student group for a course.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Cohort Name</Label>
              <Input placeholder="e.g., Sec 3 Math - Tue/Thu" />
            </div>
            <div className="space-y-2">
              <Label>Course</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {demoCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Schedule</Label>
              <Input placeholder="e.g., Tue & Thu, 4:00 PM" />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCohort}>Create Cohort</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Students Dialog */}
      <Dialog open={manageStudentsOpen} onOpenChange={setManageStudentsOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Manage Students</DialogTitle>
            <DialogDescription>
              Add or remove students from {selectedCohort?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2 mb-4">
              <Label>Add Students</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Search and select students" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="stu-1">Wei Lin Tan</SelectItem>
                  <SelectItem value="stu-2">Aisha Binti Hassan</SelectItem>
                  <SelectItem value="stu-3">Ryan Koh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Currently enrolled: {selectedCohort?.studentsCount} {selectedCohort?.studentsCount === 1 ? 'student' : 'students'}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManageStudentsOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              toast({ title: "Students Updated", description: "Cohort enrollment has been updated." });
              setManageStudentsOpen(false);
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}