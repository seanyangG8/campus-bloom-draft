import { useState } from "react";
import { Ticket, Search } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Session, demoStudents, Student } from "@/lib/demo-data";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MarkMakeUpDialogProps {
  session: Session | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MarkMakeUpDialog({ 
  session, 
  open, 
  onOpenChange 
}: MarkMakeUpDialogProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Filter students with make-up credits
  const studentsWithCredits = demoStudents.filter(s => s.makeUpCredits > 0);
  const filteredStudents = studentsWithCredits.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleMarkMakeUp = () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "Select Students",
        description: "Please select at least one student to mark as make-up.",
        variant: "destructive",
      });
      return;
    }

    const studentNames = selectedStudents
      .map(id => demoStudents.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    toast({
      title: "Make-up Applied",
      description: `Session marked as make-up for ${selectedStudents.length} student${selectedStudents.length > 1 ? 's' : ''}. Credits deducted.`,
    });

    setSelectedStudents([]);
    setSearchQuery("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedStudents([]);
    setSearchQuery("");
    onOpenChange(false);
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            Mark as Make-up
          </DialogTitle>
          <DialogDescription>
            Select students using make-up credits for "{session.title}".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Info */}
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <p className="text-muted-foreground">
              This will deduct 1 make-up credit from each selected student and tag their attendance as a make-up session.
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Student List */}
          {studentsWithCredits.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Ticket className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No students have make-up credits.</p>
            </div>
          ) : (
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {filteredStudents.map((student) => (
                  <div 
                    key={student.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50 hover:border-border transition-colors cursor-pointer"
                    onClick={() => toggleStudent(student.id)}
                  >
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => toggleStudent(student.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                    </div>
                    <div className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">
                      {student.makeUpCredits} credit{student.makeUpCredits !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}

                {filteredStudents.length === 0 && searchQuery && (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No students found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {selectedStudents.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleMarkMakeUp} 
            disabled={selectedStudents.length === 0}
          >
            Apply Make-up Credits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
