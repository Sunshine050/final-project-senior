"use client"

import { Shield, Map, AlertCircle, TrendingUp, Activity, Target, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSupervisorDashboard } from "@/hooks/useSupervisorDashboard"
import { Emergency, RescueTeam } from "@/types/emergency"

export function SupervisorView() {
  const {
    activeEmergencies,
    rescueTeams,
    stats,
    isLoading,
    error,
    isConnected,
    refreshData,
  } = useSupervisorDashboard()

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

      {/* Supervisor Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Teams Supervised"
          value={stats.teamsSupervised.toString()}
          icon={<Shield className="h-6 w-6" />}
          color="bg-blue-500"
          status="All active"
        />
        <StatCard
          title="Active Operations"
          value={stats.activeOperations.toString()}
          icon={<Map className="h-6 w-6" />}
          color="bg-orange-500"
          status="In progress"
        />
        <StatCard
          title="Avg Response"
          value={stats.avgResponse}
          icon={<TrendingUp className="h-6 w-6" />}
          color="bg-green-500"
          status="Good performance"
        />
        <StatCard
          title="Critical Cases"
          value={stats.criticalCases.toString()}
          icon={<AlertCircle className="h-6 w-6" />}
          color="bg-red-500"
          status="Requiring attention"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Team Performance */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 bg-card shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500/5 to-purple-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                    <Activity className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Team Performance</CardTitle>
                    <CardDescription>Real-time metrics for your supervised teams</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={refreshData}>
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {rescueTeams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No teams available</p>
                </div>
              ) : (
                rescueTeams.map((team) => {
                  const teamEmergencies = activeEmergencies.filter(
                    (e) => e.assignedRescueTeamId === team.id
                  )
                  const utilization = team.capacity > 0
                    ? Math.round(((team.capacity - team.availableCapacity) / team.capacity) * 100)
                    : 0
                  const status = team.availableCapacity > 0 ? 'excellent' : 'good'

                  return (
                    <PerformanceRow
                      key={team.id}
                      team={team.name}
                      cases={teamEmergencies.length}
                      utilization={utilization}
                      status={status}
                      available={team.availableCapacity}
                      total={team.capacity}
                    />
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Supervision Controls */}
        <div>
          <Card className="border-border/50 bg-card shadow-lg h-full">
            <CardHeader className="bg-gradient-to-r from-blue-500/5 to-purple-500/5">
              <CardTitle className="text-lg">Controls</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <Button
                className="w-full bg-blue-500 text-white hover:bg-blue-600 h-11 font-semibold"
                onClick={refreshData}
              >
                Refresh Data
              </Button>
              <Button
                variant="outline"
                className="w-full border-border/30 h-11 font-semibold bg-transparent"
                onClick={() => window.open('/rescue/dashboard', '_blank')}
              >
                View Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Status Overview */}
      <Card className="border-border/50 bg-card shadow-lg">
        <CardHeader className="bg-gradient-to-r from-yellow-500/5 to-orange-500/5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/20">
              <Target className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Live Team Status</CardTitle>
              <CardDescription>Current status of all teams</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {rescueTeams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No teams available</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {rescueTeams.map((team) => {
                const teamEmergencies = activeEmergencies.filter(
                  (e) => e.assignedRescueTeamId === team.id
                )
                const isAvailable = team.availableCapacity > 0
                const status = isAvailable ? 'Available' : 'Busy'
                const color = isAvailable ? 'bg-green-500' : 'bg-red-500'

                return (
                  <TeamStatusWidget
                    key={team.id}
                    team={team.name}
                    status={status}
                    color={color}
                    location={team.address}
                    activeMissions={teamEmergencies.length}
                  />
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ title, value, icon, color, status }: any) {
  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-secondary hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">{title}</p>
            <p className="text-4xl font-bold text-foreground mt-2">{value}</p>
            <p className="text-xs text-muted-foreground mt-2">{status}</p>
          </div>
          <div className={`p-4 rounded-xl ${color}/10`}>
            <div className={`${color} text-white`}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PerformanceRow({
  team,
  cases,
  utilization,
  status,
  available,
  total,
}: {
  team: string
  cases: number
  utilization: number
  status: string
  available: number
  total: number
}) {
  const statusColor = status === "excellent" ? "bg-green-500" : "bg-yellow-500"

  return (
    <div className="p-4 rounded-lg border border-border/30 hover:border-border/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-sm text-foreground">{team}</p>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor} text-white`}>
          {status === "excellent" ? "Available" : "Busy"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-2">
        <div>
          Active Cases: <span className="font-semibold text-foreground">{cases}</span>
        </div>
        <div>
          Capacity: <span className="font-semibold text-foreground">{available}/{total}</span>
        </div>
      </div>
      <div className="mt-3 w-full bg-background rounded-full h-2">
        <div
          className={`h-full rounded-full ${statusColor}`}
          style={{ width: `${utilization}%` }}
        />
      </div>
    </div>
  )
}

function TeamStatusWidget({
  team,
  status,
  color,
  location,
  activeMissions,
}: {
  team: string
  status: string
  color: string
  location: string
  activeMissions: number
}) {
  return (
    <div className="p-4 rounded-lg border border-border/30 hover:border-border/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`w-3 h-3 rounded-full ${color} flex-shrink-0 mt-1.5`} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground">{team}</p>
          <p className="text-xs text-muted-foreground truncate">{location}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${color} text-white`}>
              {status}
            </span>
            {activeMissions > 0 && (
              <span className="text-xs text-muted-foreground">
                {activeMissions} mission{activeMissions > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
