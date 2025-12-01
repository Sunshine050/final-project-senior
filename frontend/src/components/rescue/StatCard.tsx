"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "critical" | "success" | "warning";
  className?: string;
}

const variantStyles = {
  default: {
    card: "bg-white border-slate-200/60 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/10",
    icon: "bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/25",
    value: "text-slate-800",
    title: "text-slate-500",
  },
  critical: {
    card: "bg-white border-red-200/60 hover:border-red-300 hover:shadow-lg hover:shadow-red-500/10",
    icon: "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25",
    value: "text-red-600",
    title: "text-slate-500",
  },
  success: {
    card: "bg-white border-emerald-200/60 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10",
    icon: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25",
    value: "text-emerald-600",
    title: "text-slate-500",
  },
  warning: {
    card: "bg-white border-amber-200/60 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/10",
    icon: "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25",
    value: "text-amber-600",
    title: "text-slate-500",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card className={cn(styles.card, "border shadow-sm transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={cn("text-sm font-medium mb-1", styles.title)}>{title}</p>
            <p className={cn("text-3xl font-bold", styles.value)}>{value}</p>
            {trend && (
              <p
                className={cn(
                  "text-xs mt-1 font-medium",
                  trend.isPositive ? "text-emerald-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from
                yesterday
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", styles.icon)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default StatCard;
