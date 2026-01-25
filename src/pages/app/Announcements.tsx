import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Bell, 
  Megaphone,
  Calendar,
  BookOpen,
  AlertCircle,
  Info,
  CheckCircle2,
  ChevronRight,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/contexts/AppContext";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  date: string;
  read: boolean;
  category: 'general' | 'course' | 'schedule' | 'payment';
  courseName?: string;
}

const demoAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'New Chapter Available',
    message: 'Chapter 3: Polynomials is now available in Secondary 3 Mathematics. Make sure to complete Chapter 2 first before proceeding.',
    type: 'info',
    date: 'Today, 10:30 AM',
    read: false,
    category: 'course',
    courseName: 'Secondary 3 Mathematics',
  },
  {
    id: 'ann-2',
    title: 'Class Rescheduled',
    message: 'Tomorrow\'s class (Tuesday, 4:00 PM) has been rescheduled to Wednesday, 4:00 PM due to unforeseen circumstances. Please update your calendar.',
    type: 'warning',
    date: 'Today, 9:00 AM',
    read: false,
    category: 'schedule',
  },
  {
    id: 'ann-3',
    title: 'Quiz Results Published',
    message: 'Results for the Quadratic Equations Quiz are now available. Check your progress page to view your score and feedback.',
    type: 'success',
    date: 'Yesterday',
    read: true,
    category: 'course',
    courseName: 'Secondary 3 Mathematics',
  },
  {
    id: 'ann-4',
    title: 'Invoice Reminder',
    message: 'Your January invoice is due in 3 days. Please ensure timely payment to avoid any service interruption.',
    type: 'urgent',
    date: '2 days ago',
    read: true,
    category: 'payment',
  },
  {
    id: 'ann-5',
    title: 'Welcome to the New Term!',
    message: 'We\'re excited to start the new term with you. Check out our updated course materials and new features in the learning platform.',
    type: 'info',
    date: '1 week ago',
    read: true,
    category: 'general',
  },
];

export function AnnouncementsPage() {
  const { currentRole } = useApp();
  const [announcements, setAnnouncements] = useState(demoAnnouncements);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const unreadCount = announcements.filter(a => !a.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-5 w-5 text-primary" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-warning" />;
      case 'success': return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'urgent': return <Megaphone className="h-5 w-5 text-destructive" />;
      default: return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'schedule': return <Calendar className="h-4 w-4" />;
      case 'payment': return <AlertCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const handleOpenAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setDetailOpen(true);
    // Mark as read
    if (!announcement.read) {
      setAnnouncements(prev => 
        prev.map(a => a.id === announcement.id ? { ...a, read: true } : a)
      );
    }
  };

  const markAllAsRead = () => {
    setAnnouncements(prev => prev.map(a => ({ ...a, read: true })));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Announcements</h1>
          <p className="text-muted-foreground">Stay updated with the latest news</p>
        </motion.div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <StatusBadge 
              status="warning" 
              label={`${unreadCount} unread`} 
            />
          )}
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Announcements List */}
      <div className="divide-y divide-border/50 bg-card rounded-lg border overflow-hidden">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className={`p-4 cursor-pointer transition-all hover:bg-muted/30 border-l-2 ${
              !announcement.read 
                ? 'border-l-primary/60 bg-primary/5' 
                : 'border-l-transparent'
            }`}
            onClick={() => handleOpenAnnouncement(announcement)}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                announcement.type === 'info' ? 'bg-primary/10' :
                announcement.type === 'warning' ? 'bg-warning/10' :
                announcement.type === 'success' ? 'bg-success/10' :
                'bg-destructive/10'
              }`}>
                {getTypeIcon(announcement.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-semibold ${!announcement.read ? '' : 'text-muted-foreground'}`}>
                      {announcement.title}
                    </h3>
                    {!announcement.read && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {announcement.message}
                </p>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{announcement.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getCategoryIcon(announcement.category)}
                    <span className="capitalize">{announcement.category}</span>
                  </div>
                  {announcement.courseName && (
                    <span className="text-primary">{announcement.courseName}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {announcements.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg">No announcements</h3>
          <p className="text-muted-foreground">You're all caught up!</p>
        </div>
      )}

      {/* Announcement Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              {selectedAnnouncement && getTypeIcon(selectedAnnouncement.type)}
              <StatusBadge 
                status={
                  selectedAnnouncement?.type === 'info' ? 'info' :
                  selectedAnnouncement?.type === 'warning' ? 'warning' :
                  selectedAnnouncement?.type === 'success' ? 'success' : 'error'
                }
                label={selectedAnnouncement?.type || ''}
              />
            </div>
            <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              {selectedAnnouncement?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-foreground leading-relaxed">
              {selectedAnnouncement?.message}
            </p>
            {selectedAnnouncement?.courseName && (
              <div className="mt-4 p-3 rounded-lg bg-muted/50 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{selectedAnnouncement.courseName}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>
              Close
            </Button>
            {selectedAnnouncement?.category === 'course' && (
              <Button>
                <BookOpen className="h-4 w-4 mr-2" />
                Go to Course
              </Button>
            )}
            {selectedAnnouncement?.category === 'schedule' && (
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                View Timetable
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}