import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/demo-data";

const roleConfig: Record<UserRole, { label: string; className: string }> = {
  admin: { label: 'Admin', className: 'bg-role-admin/10 text-role-admin border-role-admin/20' },
  tutor: { label: 'Tutor', className: 'bg-role-tutor/10 text-role-tutor border-role-tutor/20' },
  student: { label: 'Student', className: 'bg-role-student/10 text-role-student border-role-student/20' },
  parent: { label: 'Parent', className: 'bg-role-parent/10 text-role-parent border-role-parent/20' },
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
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
