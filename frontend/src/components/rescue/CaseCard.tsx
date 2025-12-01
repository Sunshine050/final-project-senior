"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Clock,
  AlertTriangle,
  Navigation,
  CheckCircle,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Emergency,
  EmergencyStatus,
  EmergencySeverity,
} from "@/types/emergency";

interface CaseCardProps {
  emergency: Emergency;
  onStatusUpdate?: (id: string, status: EmergencyStatus) => void;
  onViewDetails?: (id: string) => void;
  className?: string;
}

const severityConfig: Record<
  EmergencySeverity,
  { label: string; className: string }
> = {
  critical: {
    label: "Critical",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  high: {
    label: "High",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  low: {
    label: "Low",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
};

const statusConfig: Record<
  EmergencyStatus,
  {
    label: string;
    className: string;
    nextStatus?: EmergencyStatus;
    nextLabel?: string;
  }
> = {
  pending: {
    label: "Pending",
    className: "bg-slate-100 text-slate-600",
    nextStatus: "assigned",
    nextLabel: "Accept",
  },
  assigned: {
    label: "Assigned",
    className: "bg-blue-100 text-blue-700",
    nextStatus: "en_route",
    nextLabel: "Start Route",
  },
  en_route: {
    label: "En Route",
    className: "bg-purple-100 text-purple-700",
    nextStatus: "on_scene",
    nextLabel: "Arrived",
  },
  on_scene: {
    label: "On Scene",
    className: "bg-amber-100 text-amber-700",
    nextStatus: "transporting",
    nextLabel: "Transport",
  },
  transporting: {
    label: "Transporting",
    className: "bg-cyan-100 text-cyan-700",
    nextStatus: "completed",
    nextLabel: "Complete",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700",
  },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function CaseCard({
  emergency,
  onStatusUpdate,
  onViewDetails,
  className,
}: CaseCardProps) {
  const severity = severityConfig[emergency.severity];
  const status = statusConfig[emergency.status];

  const handleNextStatus = () => {
    if (status.nextStatus && onStatusUpdate) {
      onStatusUpdate(emergency.id, status.nextStatus);
    }
  };

  return (
    <Card
      className={cn(
        "bg-white border-slate-200/60 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 cursor-pointer",
        emergency.severity === "critical" && "border-red-300 ring-2 ring-red-100",
        className
      )}
      onClick={() => onViewDetails?.(emergency.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge className={cn("border font-medium", severity.className)}>
              {emergency.severity === "critical" && (
                <AlertTriangle className="w-3 h-3 mr-1" />
              )}
              {severity.label}
            </Badge>
            <Badge className={cn("font-medium", status.className)}>{status.label}</Badge>
          </div>
          <span className="text-xs text-slate-500 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            {formatTimeAgo(emergency.createdAt)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Description */}
        <div>
          <p className="text-slate-800 font-medium line-clamp-2">
            {emergency.description}
          </p>
          {emergency.emergencyType && (
            <p className="text-sm text-slate-500 mt-1">
              {emergency.emergencyType}
            </p>
          )}
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <MapPin className="w-4 h-4 mt-0.5 text-teal-500 flex-shrink-0" />
          <span className="line-clamp-2">{emergency.address}</span>
        </div>

        {/* Caller Info */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Users className="w-4 h-4 text-slate-400" />
            <span>{emergency.callerName}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-4 h-4 text-slate-400" />
            <span>{emergency.callerPhone}</span>
          </div>
        </div>

        {/* Patient Count */}
        {emergency.patientCount > 1 && (
          <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg inline-block">
            {emergency.patientCount} patients involved
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
          {status.nextStatus && status.nextLabel && (
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/25"
              onClick={handleNextStatus}
            >
              {status.nextStatus === "en_route" && (
                <Navigation className="w-4 h-4 mr-1" />
              )}
              {status.nextStatus === "completed" && (
                <CheckCircle className="w-4 h-4 mr-1" />
              )}
              {status.nextLabel}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-teal-300"
            onClick={() => onViewDetails?.(emergency.id)}
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default CaseCard;
