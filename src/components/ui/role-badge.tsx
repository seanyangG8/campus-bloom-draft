import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/demo-data";

const roleConfig: Record<UserRole, { label: string; color: string }> = {
  admin: { label: 'Admin', color: 'bg-role-admin' },
  tutor: { label: 'Tutor', color: 'bg-role-tutor' },
  student: { label: 'Student', color: 'bg-role-student' },
  parent: { label: 'Parent', color: 'bg-role-parent' },
};

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = roleConfig[role];
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.color)} />
      {config.label}
    </span>
  );
}
