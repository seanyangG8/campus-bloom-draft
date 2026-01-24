import { cn } from "@/lib/utils";

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const statusConfig: Record<StatusType, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-info/10 text-info border-info/20',
  neutral: 'bg-muted text-muted-foreground border-border',
};

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  className?: string;
  dot?: boolean;
}

export function StatusBadge({ status, label, className, dot = false }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border max-w-full",
        statusConfig[status],
        className
      )}
    >
      {dot && (
        <span className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === 'success' && 'bg-success',
          status === 'warning' && 'bg-warning',
          status === 'error' && 'bg-destructive',
          status === 'info' && 'bg-info',
          status === 'neutral' && 'bg-muted-foreground',
        )} />
      )}
      <span className="min-w-0 truncate">{label}</span>
    </span>
  );
}
