import { cn } from "@/lib/utils";

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const statusConfig: Record<StatusType, { dot: string; text: string }> = {
  success: { dot: 'bg-success', text: 'text-success' },
  warning: { dot: 'bg-warning', text: 'text-warning' },
  error: { dot: 'bg-destructive', text: 'text-destructive' },
  info: { dot: 'bg-info', text: 'text-info' },
  neutral: { dot: 'bg-muted-foreground', text: 'text-muted-foreground' },
};

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  className?: string;
  dot?: boolean;
}

export function StatusBadge({ status, label, className, dot = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium max-w-full",
        className
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dot)} />
      )}
      <span className={cn("min-w-0 truncate", config.text)}>{label}</span>
    </span>
  );
}
