import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'success' | 'warning';
}

export function ProgressRing({ 
  progress, 
  size = 40, 
  strokeWidth = 3, 
  className,
  showLabel = true,
  variant = 'default'
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const strokeColor = {
    default: 'stroke-accent',
    success: 'stroke-success',
    warning: 'stroke-warning',
  }[variant];

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-300 ease-out", strokeColor)}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-[10px] font-medium text-foreground">
          {progress}%
        </span>
      )}
    </div>
  );
}
