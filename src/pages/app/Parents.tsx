import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Users, 
  Mail,
  Phone,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Label } from "@/components/ui/label";
import { demoParents, demoStudents, Parent } from "@/lib/demo-data";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

export function ParentsPage() {
  const { toast } = useToast();
  const { currentRole } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const filteredParents = demoParents.filter(
    (parent) =>
      parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLinkedStudents = (studentIds: string[]) => {
    return demoStudents.filter((s) => studentIds.includes(s.id));
  };

  const handleAddParent = () => {
    toast({
      title: "Parent Added",
      description: "New parent account has been created.",
    });
    setAddDialogOpen(false);
  };

  const handleViewParent = (parent: Parent) => {
    setSelectedParent(parent);
    setViewDialogOpen(true);
  };

  const handleSendMessage = (parent: Parent) => {
    toast({
      title: "Message Sent",
      description: `Message sent to ${parent.name}.`,
    });
  };

  const handleDeleteParent = (parent: Parent) => {
    toast({
      title: "Parent Removed",
      description: `${parent.name} has been removed.`,
    });
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
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Parents</h1>
          <p className="text-muted-foreground">Manage parent accounts and linked students</p>
        </motion.div>
        {isAdmin && (
          <Button onClick={() => setAddDialogOpen(true)} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Parent
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
            placeholder="Search parents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Parents Table */}
      <motion.div
        className="bg-card rounded-xl border shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>Parent</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Linked Students</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParents.map((parent) => {
                const linkedStudents = getLinkedStudents(parent.studentIds);
                return (
                  <TableRow key={parent.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{parent.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{parent.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <span className="whitespace-nowrap tabular-nums">{parent.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {linkedStudents.map((student) => (
                          <span
                            key={student.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs"
                          >
                            <GraduationCap className="h-3 w-3" />
                            {student.name}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem onClick={() => handleViewParent(parent)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendMessage(parent)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          {isAdmin && (
                            <>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Parent
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteParent(parent)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Parent
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredParents.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg">No parents found</h3>
            <p className="text-muted-foreground">Try adjusting your search or add a new parent.</p>
          </div>
        )}
      </motion.div>

      {/* Add Parent Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add New Parent</DialogTitle>
            <DialogDescription>
              Create a parent account and link to students.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="e.g., Mrs. Tan Mei Ling" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="parent@email.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input placeholder="+65 9123 4567" />
            </div>
            <div className="space-y-2">
              <Label>Link to Students</Label>
              <Input placeholder="Search students to link..." />
              <p className="text-xs text-muted-foreground">
                You can link students after creating the parent account.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddParent}>Add Parent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Parent Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{selectedParent?.name}</DialogTitle>
            <DialogDescription>Parent account details</DialogDescription>
          </DialogHeader>
          {selectedParent && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{selectedParent.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-sm">{selectedParent.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Linked Students</p>
                <div className="space-y-2">
                  {getLinkedStudents(selectedParent.studentIds).map((student) => (
                    <div key={student.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{student.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => selectedParent && handleSendMessage(selectedParent)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}