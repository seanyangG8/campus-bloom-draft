import { useState } from "react";
import { 
  UserPlus, 
  MoreVertical, 
  Shield, 
  User as UserIcon,
  Crown,
  Mail,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/hooks/use-toast";
import { demoTeamMembers, TeamMember, TeamMemberRole } from "@/lib/demo-data";
import { InviteTeamMemberDialog } from "@/components/dialogs/InviteTeamMemberDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const roleIcons: Record<TeamMemberRole, React.ReactNode> = {
  owner: <Crown className="h-4 w-4 text-amber-500" />,
  admin: <Shield className="h-4 w-4 text-primary" />,
  tutor: <UserIcon className="h-4 w-4 text-muted-foreground" />,
};

const roleLabels: Record<TeamMemberRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  tutor: 'Tutor',
};

export function TeamTab() {
  const { toast } = useToast();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(demoTeamMembers);

  const handleInvite = (email: string, role: TeamMemberRole) => {
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      status: 'invited',
      invitedAt: new Date().toISOString().split('T')[0],
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const handleResendInvite = (member: TeamMember) => {
    toast({
      title: "Invitation Resent",
      description: `A new invitation has been sent to ${member.email}.`,
    });
  };

  const handleDeactivate = (member: TeamMember) => {
    setTeamMembers(teamMembers.map(m => 
      m.id === member.id ? { ...m, status: 'deactivated' as const } : m
    ));
    toast({
      title: "User Deactivated",
      description: `${member.name} has been deactivated.`,
    });
  };

  const handleReactivate = (member: TeamMember) => {
    setTeamMembers(teamMembers.map(m => 
      m.id === member.id ? { ...m, status: 'active' as const } : m
    ));
    toast({
      title: "User Reactivated",
      description: `${member.name} has been reactivated.`,
    });
  };

  const activeCount = teamMembers.filter(m => m.status === 'active').length;
  const invitedCount = teamMembers.filter(m => m.status === 'invited').length;

  return (
    <div className="bg-card rounded-xl border shadow-card p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">Team Members</h2>
          <p className="text-sm text-muted-foreground">
            Manage who has access to your centre
          </p>
        </div>
        <Button onClick={() => setInviteDialogOpen(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>
      <Separator />

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <span className="text-muted-foreground">
          <span className="font-medium text-foreground">{activeCount}</span> active
        </span>
        {invitedCount > 0 && (
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">{invitedCount}</span> pending
          </span>
        )}
      </div>

      {/* Team Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Member</TableHead>
              <TableHead className="min-w-[100px]">Role</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[120px]">Joined</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow 
                key={member.id}
                className={member.status === 'deactivated' ? 'opacity-60' : ''}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {roleIcons[member.role]}
                    <span className="text-sm">{roleLabels[member.role]}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={
                      member.status === 'active' ? 'success' :
                      member.status === 'invited' ? 'warning' : 'neutral'
                    }
                    label={member.status}
                    dot
                  />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {member.status === 'invited' 
                    ? `Invited ${member.invitedAt}` 
                    : member.joinedAt
                  }
                </TableCell>
                <TableCell>
                  {member.role !== 'owner' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {member.status === 'invited' && (
                          <DropdownMenuItem onClick={() => handleResendInvite(member)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Resend Invitation
                          </DropdownMenuItem>
                        )}
                        {member.status === 'active' && (
                          <DropdownMenuItem 
                            onClick={() => handleDeactivate(member)}
                            className="text-destructive"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                        )}
                        {member.status === 'deactivated' && (
                          <DropdownMenuItem onClick={() => handleReactivate(member)}>
                            <Check className="mr-2 h-4 w-4" />
                            Reactivate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Permissions Info */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-3">
        <h4 className="text-sm font-medium">Role Permissions</h4>
        <div className="grid gap-2 text-sm">
          <div className="flex items-start gap-2">
            <Crown className="h-4 w-4 text-amber-500 mt-0.5" />
            <div>
              <span className="font-medium">Owner/Admin:</span>
              <span className="text-muted-foreground ml-1">Full access to all features including billing and settings.</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <UserIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <span className="font-medium">Tutor:</span>
              <span className="text-muted-foreground ml-1">Dashboard, Courses (read), Cohorts (read), Assessments, Submissions, Messages.</span>
            </div>
          </div>
        </div>
      </div>

      <InviteTeamMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onInvite={handleInvite}
      />
    </div>
  );
}
