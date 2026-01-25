import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
  lines?: number;
}

export function SkeletonLoader({ 
  className, 
  variant = "rectangular",
  lines = 1 
}: SkeletonLoaderProps) {
  const baseClasses = "animate-pulse bg-muted/60 rounded";
  
  if (variant === "text") {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i} 
            className={cn(
              baseClasses, 
              "h-4",
              i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
            )} 
          />
        ))}
      </div>
    );
  }
  
  if (variant === "circular") {
    return <div className={cn(baseClasses, "rounded-full aspect-square", className)} />;
  }
  
  if (variant === "card") {
    return (
      <div className={cn("rounded-xl border bg-card p-6 space-y-4", className)}>
        <div className={cn(baseClasses, "h-4 w-1/3")} />
        <div className="space-y-2">
          <div className={cn(baseClasses, "h-3 w-full")} />
          <div className={cn(baseClasses, "h-3 w-5/6")} />
          <div className={cn(baseClasses, "h-3 w-2/3")} />
        </div>
      </div>
    );
  }
  
  return <div className={cn(baseClasses, className)} />;
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="bg-muted/30 p-4 border-b">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-3 bg-muted/60 rounded animate-pulse flex-1" />
          ))}
        </div>
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div 
                key={colIndex} 
                className={cn(
                  "h-4 bg-muted/40 rounded animate-pulse flex-1",
                  colIndex === 0 && "w-1/4 flex-none"
                )} 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card shadow-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 bg-muted/60 rounded animate-pulse" />
        <div className="h-8 w-8 bg-muted/60 rounded-full animate-pulse" />
      </div>
      <div className="h-8 w-20 bg-muted/60 rounded animate-pulse" />
      <div className="h-3 w-32 bg-muted/40 rounded animate-pulse" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-3 w-20 bg-muted/60 rounded animate-pulse" />
        <div className="h-10 w-10 bg-muted/40 rounded-full animate-pulse" />
      </div>
      <div className="h-7 w-16 bg-muted/60 rounded animate-pulse mb-2" />
      <div className="h-3 w-24 bg-muted/40 rounded animate-pulse" />
    </div>
  );
}
