"use client"

import { AlertCircle, Users, TrendingUp, Zap, Phone, Clock, MapPin, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDispatchDashboard } from "@/hooks/useDispatchDashboard"
import { Emergency, EmergencyStatus, EmergencySeverity } from "@/types/emergency"
import { formatDistanceToNow } from "date-fns"

export function DispatchView() {
  const {
    pendingEmergencies,
    rescueTeams,
    hospitals,
    stats,
    isLoading,
    error,
    isConnected,
    refreshData,
    assignEmergency,
  } = useDispatchDashboard()

  const handleAssign = async (emergencyId: string, rescueTeamId: string) => {
    try {
      await assignEmergency(emergencyId, undefined, rescueTeamId)
    } catch (err) {
      console.error('Failed to assign:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Connection Status */}
      {!isConnected && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          ⚠️ WebSocket disconnected - Real-time updates unavailable
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Dispatch Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Calls in Queue"
          value={stats.callsInQueue.toString()}
          icon={<AlertCircle className="h-6 w-6" />}
          color="bg-red-500"
          trend={`${stats.criticalCalls} critical`}
        />
        <StatCard
          title="Dispatched Units"
          value={stats.dispatchedUnits.toString()}
          icon={<Users className="h-6 w-6" />}
          color="bg-blue-500"
          trend="All responding"
        />
        <StatCard
          title="Response Time"
          value={stats.avgResponseTime}
          icon={<TrendingUp className="h-6 w-6" />}
          color="bg-green-500"
          trend="Avg duration"
        />
        <StatCard
          title="System Load"
          value={`${Math.round((stats.dispatchedUnits / (rescueTeams.length || 1)) * 100)}%`}
          icon={<Zap className="h-6 w-6" />}
          color="bg-yellow-500"
          trend="Moderate activity"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Call Queue */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-border/50 bg-card shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-500/5 to-blue-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
                    <Phone className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Incoming Call Queue</CardTitle>
                    <CardDescription>
                      {pendingEmergencies.length} calls waiting - Priority ordered by severity
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={refreshData}>
                  <Clock className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {pendingEmergencies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending calls</p>
                </div>
              ) : (
                pendingEmergencies
                  .sort((a, b) => {
                    const severityOrder: Record<EmergencySeverity, number> = {
                      critical: 4,
                      high: 3,
                      medium: 2,
                      low: 1,
                    }
                    return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0)
                  })
                  .map((emergency) => (
                    <CallItem
                      key={emergency.id}
                      emergency={emergency}
                      onAssign={handleAssign}
                      rescueTeams={rescueTeams}
                    />
                  ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="border-border/50 bg-card shadow-lg h-full">
            <CardHeader className="bg-gradient-to-r from-blue-500/5 to-purple-500/5">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <Button
                className="w-full bg-red-500 text-white hover:bg-red-600 h-12 font-semibold"
                onClick={refreshData}
              >
                Refresh Queue
              </Button>
              <Button
                className="w-full bg-blue-500 text-white hover:bg-blue-600 h-12 font-semibold"
                onClick={() => window.open('/rescue/dashboard', '_blank')}
              >
                View Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color, trend }: any) {
  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-secondary hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">{title}</p>
            <p className="text-4xl font-bold text-foreground mt-2">{value}</p>
            <p className="text-xs text-muted-foreground mt-2">{trend}</p>
          </div>
          <div className={`p-4 rounded-xl ${color}/10`}>
            <div className={`${color} text-white`}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CallItem({
  emergency,
  onAssign,
  rescueTeams,
}: {
  emergency: Emergency
  onAssign: (emergencyId: string, rescueTeamId: string) => void
  rescueTeams: any[]
}) {
  const severityColor: Record<EmergencySeverity, string> = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  }

  const waitTime = emergency.createdAt
    ? formatDistanceToNow(new Date(emergency.createdAt), { addSuffix: true })
    : "Just now"

  const availableTeams = rescueTeams.filter(t => t.availableCapacity > 0)

  return (
    <div className="p-4 rounded-lg border border-border/30 hover:border-border/50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-3 h-3 rounded-full ${severityColor[emergency.severity]} animate-pulse`} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-sm text-foreground">{emergency.description}</p>
              <Badge variant="outline" className="text-xs">
                {emergency.severity}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {emergency.address}
            </p>
            {emergency.callerName && (
              <p className="text-xs text-muted-foreground mt-1">
                Caller: {emergency.callerName} ({emergency.callerPhone})
              </p>
            )}
          </div>
        </div>
        <div className="text-right ml-4">
          <p className="text-sm font-bold text-foreground">{waitTime}</p>
        </div>
      </div>
      
      {availableTeams.length > 0 && (
        <div className="flex gap-2 mt-3">
          {availableTeams.slice(0, 3).map((team) => (
            <Button
              key={team.id}
              size="sm"
              className="bg-blue-500 text-white hover:bg-blue-600 text-xs"
              onClick={() => onAssign(emergency.id, team.id)}
            >
              Assign {team.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
