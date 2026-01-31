import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  Clock, 
  BookOpen,
  Video,
  MoreHorizontal,
  UserPlus,
  Edit,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { demoCohorts, demoCourses, demoStudents, demoSessions, demoTeamMembers, Student } from "@/lib/demo-data";
import { useApp } from "@/contexts/AppContext";

export function CohortDetailPage() {
  const { cohortId } = useParams<{ cohortId: string }>();
  const navigate = useNavigate();
  const { currentRole } = useApp();
  
  const cohort = demoCohorts.find((c) => c.id === cohortId);
  const course = cohort ? demoCourses.find((c) => c.id === cohort.courseId) : null;
  const tutor = cohort ? demoTeamMembers.find((t) => t.id === cohort.tutorId || t.id === 'tm-2') : null;
  const sessions = demoSessions.filter((s) => s.cohortId === cohortId);
  
  // Mock students for this cohort (in real app, would filter by cohort enrollment)
  const cohortStudents = demoStudents.slice(0, cohort?.studentsCount || 0);
  
  const isAdmin = currentRole === 'admin';

  if (!cohort) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-lg font-semibold mb-2">Cohort not found</h2>
        <p className="text-muted-foreground mb-4">The cohort you're looking for doesn't exist.</p>
        <Button variant="outline" onClick={() => navigate('/app/cohorts')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cohorts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-fit -ml-2"
          onClick={() => navigate('/app/cohorts')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Cohorts
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                {cohort.name}
              </h1>
              <StatusBadge
                status={
                  cohort.status === 'active' ? 'success' :
                  cohort.status === 'upcoming' ? 'info' : 'neutral'
                }
                label={cohort.status}
              />
            </div>
            <p className="text-muted-foreground">{course?.title || 'Unknown Course'}</p>
          </div>
          
          {isAdmin && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Students
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="bg-muted/30 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{cohort.studentsCount}</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/10">
                <Calendar className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm font-medium">{cohort.schedule}</p>
                <p className="text-sm text-muted-foreground">Schedule</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Clock className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium">{cohort.startDate}</p>
                <p className="text-sm text-muted-foreground">Start Date</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {tutor?.name.split(' ').map(n => n[0]).join('') || 'T'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{tutor?.name || 'Unknown'}</p>
                <p className="text-sm text-muted-foreground">Tutor</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  Enrolled Students
                </CardTitle>
                {isAdmin && (
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Message All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cohortStudents.map((student) => (
                    <StudentRow 
                      key={student.id} 
                      student={student} 
                      onNavigate={() => navigate(`/app/students/${student.id}`)}
                    />
                  ))}
                  {cohortStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No students enrolled yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Course & Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Course Info */}
          {course && (
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  Course Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div 
                  className="p-3 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/app/courses/${course.id}`)}
                >
                  <p className="font-medium mb-1">{course.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Level</p>
                    <p className="font-medium">{course.level}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Subject</p>
                    <p className="font-medium">{course.subject}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Chapters</p>
                    <p className="font-medium">{course.chaptersCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Completion</p>
                    <p className="font-medium">{course.completionRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Sessions */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Video className="h-5 w-5 text-muted-foreground" />
                  Sessions
                </CardTitle>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="h-auto p-0"
                  onClick={() => navigate('/app/timetable')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.length > 0 ? (
                  sessions.slice(0, 3).map((session) => (
                    <div 
                      key={session.id} 
                      className="p-3 rounded-lg bg-muted/30 border-l-2 border-primary"
                    >
                      <p className="font-medium text-sm mb-1">{session.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {session.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {session.time}
                        </span>
                      </div>
                      <div className="mt-2">
                        <StatusBadge
                          status={
                            session.status === 'completed' ? 'success' :
                            session.status === 'live' ? 'warning' :
                            session.status === 'cancelled' ? 'error' : 'info'
                          }
                          label={session.status}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No sessions scheduled
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function StudentRow({ 
  student, 
  onNavigate 
}: { 
  student: Student; 
  onNavigate: () => void;
}) {
  return (
    <TableRow 
      className="hover:bg-muted/30 cursor-pointer"
      onClick={onNavigate}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {student.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{student.name}</p>
            <p className="text-xs text-muted-foreground">{student.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${student.completionRate}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">{student.completionRate}%</span>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge
          status={
            student.status === 'active' ? 'success' :
            student.status === 'at-risk' ? 'warning' : 'neutral'
          }
          label={student.status}
        />
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onClick={onNavigate}>
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Send Message</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Remove from Cohort</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
