import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
  variant?: 'default' | 'accent' | 'success' | 'warning';
}

const variantStyles = {
  default: 'bg-card border-border/50',
  accent: 'gradient-accent text-accent-foreground border-0',
  success: 'bg-success/5 border-success/20',
  warning: 'bg-warning/5 border-warning/20',
};

const iconVariantStyles = {
  default: 'bg-primary/10 text-primary',
  accent: 'bg-white/20 text-white',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, className, variant = 'default' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={cn(
        "rounded-xl border p-5 shadow-card transition-shadow duration-200 hover:shadow-card-hover",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className={cn(
            "text-sm font-medium tracking-wide",
            variant === 'accent' ? 'text-white/80' : 'text-muted-foreground'
          )}>
            {title}
          </p>
          <p className={cn(
            "text-2xl font-bold font-display tracking-tight",
            variant === 'accent' ? 'text-white' : 'text-foreground'
          )}>
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-xs leading-relaxed",
              variant === 'accent' ? 'text-white/70' : 'text-muted-foreground'
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className={cn(
                "text-xs font-semibold px-1.5 py-0.5 rounded",
                trend.positive 
                  ? 'text-success bg-success/10' 
                  : 'text-destructive bg-destructive/10'
              )}>
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
              <span className={cn(
                "text-xs",
                variant === 'accent' ? 'text-white/60' : 'text-muted-foreground'
              )}>
                {trend.label}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "p-3 rounded-xl transition-transform duration-200",
            iconVariantStyles[variant]
          )}>
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
