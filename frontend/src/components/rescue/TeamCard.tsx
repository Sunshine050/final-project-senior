"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Phone, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { RescueTeam } from "@/types/emergency";

interface TeamCardProps {
  team: RescueTeam;
  onClick?: (id: string) => void;
  className?: string;
}

export function TeamCard({ team, onClick, className }: TeamCardProps) {
  const isAvailable = team.availableCapacity > 0;
  const utilizationPercent = Math.round(
    ((team.capacity - team.availableCapacity) / team.capacity) * 100
  );

  return (
    <Card
      className={cn(
        "bg-white border-slate-200/60 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 cursor-pointer",
        !isAvailable && "opacity-70",
        className
      )}
      onClick={() => onClick?.(team.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10 shadow-md">
            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-sm font-medium">
              {team.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium text-slate-800 truncate">{team.name}</h3>
              <Badge
                className={cn(
                  "text-xs font-medium",
                  isAvailable
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                )}
              >
                {isAvailable ? "Available" : "Busy"}
              </Badge>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <MapPin className="w-3 h-3 text-teal-500" />
              <span className="truncate">{team.address}</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>{team.phone}</span>
            </div>

            {/* Capacity indicator */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500 flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  Units
                </span>
                <span className="text-slate-700 font-medium">
                  {team.availableCapacity}/{team.capacity} available
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    utilizationPercent < 50
                      ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                      : utilizationPercent < 80
                      ? "bg-gradient-to-r from-amber-400 to-orange-500"
                      : "bg-gradient-to-r from-red-400 to-rose-500"
                  )}
                  style={{ width: `${utilizationPercent}%` }}
                />
              </div>
            </div>

            {/* Services */}
            {team.services.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {team.services.slice(0, 3).map((service) => (
                  <Badge
                    key={service}
                    variant="outline"
                    className="text-[10px] border-slate-200 text-slate-500 bg-slate-50"
                  >
                    {service}
                  </Badge>
                ))}
                {team.services.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] border-slate-200 text-slate-500 bg-slate-50"
                  >
                    +{team.services.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TeamCard;
