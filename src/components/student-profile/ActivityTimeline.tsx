import { cn } from "@/lib/utils";
import { 
  Calendar, 
  CreditCard, 
  Award, 
  MessageSquare, 
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";

export interface ActivityEvent {
  id: string;
  type: 'attendance' | 'invoice' | 'submission' | 'message';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error' | 'neutral';
}

interface ActivityTimelineProps {
  events: ActivityEvent[];
  className?: string;
}

const eventIcons = {
  attendance: Calendar,
  invoice: CreditCard,
  submission: Award,
  message: MessageSquare,
};

const statusColors = {
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
  neutral: 'bg-muted-foreground',
};

export function ActivityTimeline({ events, className }: ActivityTimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        Activity Timeline
      </h3>
      
      <div className="relative pl-6 space-y-4">
        {/* Vertical line */}
        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />
        
        {events.map((event) => {
          const Icon = eventIcons[event.type];
          const statusColor = event.status ? statusColors[event.status] : 'bg-muted-foreground';
          
          return (
            <div key={event.id} className="relative flex gap-3">
              {/* Dot indicator */}
              <div className={cn(
                "absolute left-[-18px] w-[14px] h-[14px] rounded-full border-2 border-background",
                statusColor
              )} />
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{event.timestamp}</p>
              </div>
            </div>
          );
        })}
        
        {events.length === 0 && (
          <div className="text-center py-6 text-muted-foreground text-sm">
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
}
