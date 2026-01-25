import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Video, 
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Play,
  ExternalLink,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { demoSessions, demoCohorts, demoCourses } from "@/lib/demo-data";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

export function TimetablePage() {
  const { toast } = useToast();
  const { currentRole } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [createSessionOpen, setCreateSessionOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<typeof demoSessions[0] | null>(null);
  const [sessionDetailOpen, setSessionDetailOpen] = useState(false);

  // Filter sessions for the selected date (mock filtering)
  const todaySessions = demoSessions;

  const handleStartSession = (session: typeof demoSessions[0]) => {
    toast({
      title: "Starting Session",
      description: `Launching ${session.title}...`,
    });
    // In real app, would open meeting link
  };

  const handleCopyLink = (session: typeof demoSessions[0]) => {
    navigator.clipboard.writeText(session.meetingLink);
    toast({
      title: "Link Copied",
      description: "Meeting link copied to clipboard.",
    });
  };

  const handleViewRecording = (session: typeof demoSessions[0]) => {
    if (session.recordingLink) {
      toast({
        title: "Opening Recording",
        description: "Loading session recording...",
      });
    } else {
      toast({
        title: "No Recording",
        description: "Recording is not available for this session.",
        variant: "destructive",
      });
    }
  };

  const handleCreateSession = () => {
    toast({
      title: "Session Created",
      description: "New session has been scheduled successfully.",
    });
    setCreateSessionOpen(false);
  };

  const handleCancelSession = (session: typeof demoSessions[0]) => {
    toast({
      title: "Session Cancelled",
      description: `${session.title} has been cancelled.`,
    });
  };

  const openSessionDetail = (session: typeof demoSessions[0]) => {
    setSelectedSession(session);
    setSessionDetailOpen(true);
  };

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-destructive/10 border-destructive/20';
      case 'scheduled':
        return 'bg-primary/10 border-primary/20';
      case 'completed':
        return 'bg-muted border-border';
      default:
        return 'bg-muted/50 border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Timetable</h1>
          <p className="text-muted-foreground">Manage your class schedule and sessions</p>
        </div>
        {(currentRole === 'admin' || currentRole === 'tutor') && (
          <Button onClick={() => setCreateSessionOpen(true)} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            New Session
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
        {/* Calendar Sidebar */}
        <div className="flex justify-center md:justify-start">
          <div className="bg-card rounded-lg border p-4 h-fit w-fit">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
            />
          
            {/* Quick Stats */}
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Today's Sessions</span>
                <span className="font-semibold">{todaySessions.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Upcoming This Week</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Students</span>
                <span className="font-semibold">48</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4 min-w-0">
          {/* View Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="font-semibold text-sm sm:text-base truncate">
                {selectedDate?.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h2>
              <Button variant="ghost" size="icon" className="shrink-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Select value={viewMode} onValueChange={(v) => setViewMode(v as 'day' | 'week')}>
              <SelectTrigger className="w-[110px] shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="day">Day View</SelectItem>
                <SelectItem value="week">Week View</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Session Cards */}
          <div className="divide-y divide-border/50 bg-card rounded-lg border">
            {todaySessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 cursor-pointer transition-all hover:bg-muted/30 border-l-2 ${
                  session.status === 'live' ? 'border-l-destructive/60 bg-destructive/5' :
                  session.status === 'scheduled' ? 'border-l-info/40' :
                  'border-l-muted-foreground/30'
                }`}
                onClick={() => openSessionDetail(session)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold truncate">{session.title}</h3>
                      <StatusBadge 
                        status={
                          session.status === 'live' ? 'error' : 
                          session.status === 'scheduled' ? 'info' : 
                          session.status === 'completed' ? 'success' : 'neutral'
                        } 
                        label={session.status === 'live' ? '● LIVE' : session.status} 
                      />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{session.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span className="whitespace-nowrap">{session.time} ({session.duration}m)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 shrink-0" />
                        <span className="whitespace-nowrap">{session.attendanceCount}/{session.totalStudents}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {session.status === 'live' && (
                      <Button size="sm" className="gap-1 bg-destructive hover:bg-destructive/90" onClick={() => handleStartSession(session)}>
                        <Play className="h-3 w-3" />
                        Join Now
                      </Button>
                    )}
                    {session.status === 'scheduled' && (currentRole === 'admin' || currentRole === 'tutor') && (
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => handleStartSession(session)}>
                        <Video className="h-3 w-3" />
                        Start
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem onClick={() => handleCopyLink(session)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Meeting Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewRecording(session)}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Recording
                        </DropdownMenuItem>
                        {(currentRole === 'admin' || currentRole === 'tutor') && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleCancelSession(session)}
                            >
                              Cancel Session
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Session Dialog */}
      <Dialog open={createSessionOpen} onOpenChange={setCreateSessionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule New Session</DialogTitle>
            <DialogDescription>
              Create a new class session for your students.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Session Title</Label>
              <Input placeholder="e.g., Sec 3 Mathematics - Algebra" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Select defaultValue="60">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cohort</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cohort" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {demoCohorts.map((cohort) => (
                      <SelectItem key={cohort.id} value={cohort.id}>
                        {cohort.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Meeting Link</Label>
              <Input placeholder="https://meet.google.com/..." />
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea placeholder="Add any session notes or agenda..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateSessionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSession}>
              Create Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Session Detail Dialog */}
      <Dialog open={sessionDetailOpen} onOpenChange={setSessionDetailOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedSession?.title}</DialogTitle>
            <DialogDescription>
              Session details and attendance
            </DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedSession.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedSession.time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedSession.duration} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge 
                    status={
                      selectedSession.status === 'live' ? 'error' : 
                      selectedSession.status === 'scheduled' ? 'info' : 
                      selectedSession.status === 'completed' ? 'success' : 'neutral'
                    } 
                    label={selectedSession.status} 
                  />
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Attendance</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${(selectedSession.attendanceCount / selectedSession.totalStudents) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {selectedSession.attendanceCount}/{selectedSession.totalStudents}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Meeting Link</p>
                <div className="flex items-center gap-2">
                  <Input value={selectedSession.meetingLink} readOnly className="flex-1" />
                  <Button variant="outline" size="icon" onClick={() => handleCopyLink(selectedSession)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSessionDetailOpen(false)}>
              Close
            </Button>
            {selectedSession?.status === 'live' && (
              <Button onClick={() => handleStartSession(selectedSession)} className="gap-2">
                <Play className="h-4 w-4" />
                Join Session
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
