import { useState } from "react";
import { Ticket, Calendar, Clock, Plus, Check, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Student, demoSessions, Session } from "@/lib/demo-data";
import { StatusBadge } from "@/components/ui/status-badge";

interface MakeUpCreditsDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CreditHistoryItem {
  id: string;
  type: 'added' | 'used';
  date: string;
  reason: string;
  sessionTitle?: string;
}

// Mock credit history
const mockCreditHistory: CreditHistoryItem[] = [
  { id: '1', type: 'added', date: '2024-01-15', reason: 'Session cancelled - Tutor unavailable' },
  { id: '2', type: 'used', date: '2024-01-20', reason: 'Applied to session', sessionTitle: 'Sec 3 Math - Algebra Review' },
  { id: '3', type: 'added', date: '2024-01-22', reason: 'Manual adjustment - Admin' },
];

export function MakeUpCreditsDialog({ 
  student, 
  open, 
  onOpenChange 
}: MakeUpCreditsDialogProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'apply' | 'add' | 'history'>('apply');
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [addCredits, setAddCredits] = useState({ amount: "1", reason: "" });

  // Get upcoming sessions that can have make-up applied
  const upcomingSessions = demoSessions.filter(s => s.status === 'scheduled');

  const handleApplyCredit = () => {
    if (!selectedSession) {
      toast({
        title: "Select a Session",
        description: "Please select a session to apply the credit to.",
        variant: "destructive",
      });
      return;
    }

    const session = upcomingSessions.find(s => s.id === selectedSession);
    toast({
      title: "Credit Applied",
      description: `Make-up credit applied to "${session?.title}".`,
    });
    setSelectedSession("");
    onOpenChange(false);
  };

  const handleAddCredits = () => {
    const amount = parseInt(addCredits.amount);
    if (!amount || amount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter at least 1 credit.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Credits Added",
      description: `${amount} make-up credit${amount > 1 ? 's' : ''} added to ${student?.name}.`,
    });
    setAddCredits({ amount: "1", reason: "" });
    onOpenChange(false);
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            Make-up Credits
          </DialogTitle>
          <DialogDescription>
            {student.name} has {student.makeUpCredits} credit{student.makeUpCredits !== 1 ? 's' : ''} available.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="apply" disabled={student.makeUpCredits === 0}>
              Apply Credit
            </TabsTrigger>
            <TabsTrigger value="add">
              Add Credits
            </TabsTrigger>
            <TabsTrigger value="history">
              History
            </TabsTrigger>
          </TabsList>

          {/* Apply Credit Tab */}
          <TabsContent value="apply" className="space-y-4 pt-4">
            {student.makeUpCredits === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Ticket className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No credits available to apply.</p>
              </div>
            ) : (
              <>
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-sm">
                  <p className="font-medium text-primary">Available Credits: {student.makeUpCredits}</p>
                  <p className="text-muted-foreground mt-1">
                    Select a session to use a make-up credit. The session will be tagged as a make-up.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Select Session</Label>
                  <Select value={selectedSession} onValueChange={setSelectedSession}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an upcoming session..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {upcomingSessions.map((session) => (
                        <SelectItem key={session.id} value={session.id}>
                          <div className="flex items-center gap-2">
                            <span>{session.title}</span>
                            <span className="text-muted-foreground text-xs">
                              {session.date}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedSession && (
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    {(() => {
                      const session = upcomingSessions.find(s => s.id === selectedSession);
                      return session ? (
                        <div className="space-y-1">
                          <p className="font-medium">{session.title}</p>
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {session.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {session.time}
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                <DialogFooter>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleApplyCredit} disabled={!selectedSession}>
                    <Check className="h-4 w-4 mr-2" />
                    Apply Credit
                  </Button>
                </DialogFooter>
              </>
            )}
          </TabsContent>

          {/* Add Credits Tab */}
          <TabsContent value="add" className="space-y-4 pt-4">
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              Current balance: <span className="font-semibold">{student.makeUpCredits} credit{student.makeUpCredits !== 1 ? 's' : ''}</span>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Credits to Add *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  max="10"
                  value={addCredits.amount}
                  onChange={(e) => setAddCredits({ ...addCredits, amount: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reason">Reason (optional)</Label>
                <Textarea
                  id="reason"
                  value={addCredits.reason}
                  onChange={(e) => setAddCredits({ ...addCredits, reason: e.target.value })}
                  placeholder="e.g., Missed class due to illness"
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCredits}>
                <Plus className="h-4 w-4 mr-2" />
                Add Credits
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <History className="h-4 w-4" />
              <span>Credit History</span>
            </div>

            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {mockCreditHistory.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg text-sm"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    item.type === 'added' 
                      ? 'bg-success/20 text-success' 
                      : 'bg-warning/20 text-warning'
                  }`}>
                    {item.type === 'added' ? '+1' : '-1'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {item.type === 'added' ? 'Credit Added' : 'Credit Used'}
                    </p>
                    <p className="text-muted-foreground text-xs truncate">{item.reason}</p>
                    {item.sessionTitle && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Session: {item.sessionTitle}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
