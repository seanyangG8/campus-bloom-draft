import { motion } from "framer-motion";
import { MessageSquare, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/ui/status-badge";

interface MessageThread {
  id: string;
  subject: string;
  lastMessage: string;
  sender: string;
  timestamp: string;
  unread: boolean;
}

interface MessagesTabProps {
  threads: MessageThread[];
  studentName: string;
  parentName?: string;
  parentPhone?: string;
}

export function MessagesTab({ threads, studentName, parentName, parentPhone }: MessagesTabProps) {
  const { toast } = useToast();

  const handleCopyWhatsApp = (message: string) => {
    navigator.clipboard.writeText(message);
    toast({
      title: "Copied to Clipboard",
      description: "Message copied for WhatsApp.",
    });
  };

  const whatsAppTemplates = [
    {
      id: 'progress',
      label: 'Progress Update',
      message: `Hi ${parentName || 'there'}! Just wanted to share that ${studentName} is making great progress in their studies. Keep up the excellent work!`,
    },
    {
      id: 'reminder',
      label: 'Session Reminder',
      message: `Hi ${parentName || 'there'}! Reminder: ${studentName} has an upcoming class. Please ensure they're ready on time.`,
    },
    {
      id: 'absence',
      label: 'Absence Follow-up',
      message: `Hi ${parentName || 'there'}, ${studentName} was absent from today's class. Please let us know if you'd like to arrange a make-up session.`,
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* WhatsApp Quick Actions */}
      <div className="bg-card rounded-lg border border-border/50 p-4">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          Quick Message Templates
        </h4>
        <div className="space-y-2">
          {whatsAppTemplates.map((template) => (
            <div 
              key={template.id}
              className="flex items-center justify-between gap-3 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{template.label}</p>
                <p className="text-xs text-muted-foreground truncate">{template.message}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1.5 shrink-0"
                onClick={() => handleCopyWhatsApp(template.message)}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
          ))}
        </div>
        
        {parentPhone && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 gap-2 w-full"
            onClick={() => window.open(`https://wa.me/${parentPhone.replace(/[^0-9]/g, '')}`, '_blank')}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open WhatsApp ({parentPhone})
          </Button>
        )}
      </div>

      {/* Message Threads */}
      <div className="bg-card rounded-lg border border-border/50">
        <div className="p-3 border-b border-border/50">
          <h4 className="text-sm font-medium text-foreground">Recent Conversations</h4>
        </div>
        
        {threads.length > 0 ? (
          <div className="divide-y divide-border/50">
            {threads.map((thread) => (
              <div 
                key={thread.id}
                className="p-3 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{thread.subject}</p>
                      {thread.unread && (
                        <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{thread.lastMessage}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {thread.sender} • {thread.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No messages yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
