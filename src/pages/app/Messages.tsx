import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  MessageSquare, 
  Copy,
  Check,
  Send,
  Users,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { whatsappTemplates } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { NewAnnouncementDialog, NewTemplateDialog } from "@/components/dialogs";

export function MessagesPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("threads");
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  
  // Dialog states
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [newTemplateOpen, setNewTemplateOpen] = useState(false);

  const threads = [
    { id: '1', name: 'Mrs. Tan Mei Ling', lastMessage: 'Thank you for the update on Wei Lin\'s progress!', time: '2h ago', unread: true },
    { id: '2', name: 'Mr. Hassan', lastMessage: 'Can we reschedule Thursday\'s class?', time: '5h ago', unread: true },
    { id: '3', name: 'Ms. Priya', lastMessage: 'Invoice has been paid.', time: '1d ago', unread: false },
  ];

  const copyTemplate = (template: typeof whatsappTemplates[0]) => {
    navigator.clipboard.writeText(template.message);
    setCopiedTemplate(template.id);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  const handleCopyForWhatsApp = () => {
    const threadData = threads.find(t => t.id === selectedThread);
    if (threadData) {
      navigator.clipboard.writeText(
        `Hi ${threadData.name},\n\nThank you for your message. Wei Lin is doing great in class!\n\nBest regards,\nBright Minds Tuition`
      );
      toast({
        title: "Copied for WhatsApp",
        description: "Conversation copied to clipboard.",
      });
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully.",
    });
    setMessageText("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-sm text-muted-foreground">Communicate with parents and students</p>
        </div>
        <Button 
          size="sm"
          className="gradient-hero text-primary-foreground gap-2 w-full sm:w-auto"
          onClick={() => setAnnouncementOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Announcement
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="threads" className="text-xs sm:text-sm">Threads</TabsTrigger>
            <TabsTrigger value="announcements" className="text-xs sm:text-sm">Announcements</TabsTrigger>
            <TabsTrigger value="templates" className="text-xs sm:text-sm">Templates</TabsTrigger>
          </TabsList>
        </div>

        {/* Threads Tab */}
        <TabsContent value="threads" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 min-h-[400px] lg:h-[calc(100vh-16rem)]">
            {/* Thread List */}
            <motion.div
              className="lg:col-span-4 bg-card rounded-xl border shadow-card overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-9" />
                </div>
              </div>
              <div className="overflow-y-auto scrollbar-thin">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread.id)}
                    className={cn(
                      "w-full p-4 text-left border-b hover:bg-muted/50 transition-colors",
                      selectedThread === thread.id && "bg-muted/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-primary">
                          {thread.name.split(' ').slice(-1)[0][0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">{thread.name}</p>
                          <span className="text-xs text-muted-foreground">{thread.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{thread.lastMessage}</p>
                      </div>
                      {thread.unread && (
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Message Thread */}
            <motion.div
              className="lg:col-span-8 bg-card rounded-xl border shadow-card overflow-hidden flex flex-col min-h-[300px]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {selectedThread ? (
                <>
                  <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">Mrs. Tan Mei Ling</p>
                        <p className="text-xs text-muted-foreground">Parent of Wei Lin Tan</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 w-full sm:w-auto shrink-0"
                      onClick={handleCopyForWhatsApp}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="hidden sm:inline">Copy for WhatsApp</span>
                      <span className="sm:hidden">Copy</span>
                    </Button>
                  </div>
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin">
                    {/* Sample messages */}
                    <div className="flex justify-start">
                      <div className="max-w-md p-3 rounded-xl bg-muted/50 rounded-tl-sm">
                        <p className="text-sm">Hi, how is Wei Lin doing in class?</p>
                        <p className="text-xs text-muted-foreground mt-1">Yesterday, 2:30 PM</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-md p-3 rounded-xl bg-primary text-primary-foreground rounded-tr-sm">
                        <p className="text-sm">Wei Lin is doing great! She's completed 78% of the course and actively participating in class.</p>
                        <p className="text-xs text-primary-foreground/70 mt-1">Yesterday, 3:15 PM</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-md p-3 rounded-xl bg-muted/50 rounded-tl-sm">
                        <p className="text-sm">Thank you for the update on Wei Lin's progress!</p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t">
                    <div className="flex items-center gap-2">
                      <Textarea 
                        placeholder="Type a message..." 
                        className="min-h-[44px] max-h-32 resize-none"
                        rows={1}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button 
                        className="gradient-accent text-accent-foreground"
                        onClick={handleSendMessage}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>Select a conversation to view messages</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </TabsContent>

        {/* WhatsApp Templates Tab */}
        <TabsContent value="templates" className="mt-6">
          <motion.div
            className="bg-card rounded-xl border shadow-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">WhatsApp Templates</h2>
                <p className="text-sm text-muted-foreground">Quick copy templates for WhatsApp messages</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 w-full sm:w-auto"
                onClick={() => setNewTemplateOpen(true)}
              >
                <Plus className="h-4 w-4" />
                New Template
              </Button>
            </div>
            <div className="p-4 space-y-4">
              {whatsappTemplates.map((template) => (
                <div 
                  key={template.id}
                  className="p-4 bg-muted/30 rounded-xl border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium">{template.name}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => copyTemplate(template)}
                    >
                      {copiedTemplate === template.id ? (
                        <>
                          <Check className="h-4 w-4 text-success" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy for WhatsApp
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono bg-muted/50 p-3 rounded-lg">
                    {template.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Variables: {'{parent_name}'}, {'{student_name}'}, {'{date}'}, {'{time}'}, etc.
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="mt-6">
          <motion.div
            className="bg-card rounded-xl border shadow-card p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-semibold mb-2">No announcements yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Send announcements to all parents or specific cohorts
            </p>
            <Button 
              className="gradient-hero text-primary-foreground gap-2"
              onClick={() => setAnnouncementOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create Announcement
            </Button>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <NewAnnouncementDialog open={announcementOpen} onOpenChange={setAnnouncementOpen} />
      <NewTemplateDialog open={newTemplateOpen} onOpenChange={setNewTemplateOpen} />
    </div>
  );
}
