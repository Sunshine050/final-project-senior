"use client"

import { Users, MapPin, Clock, AlertTriangle, Navigation2, Radio, Loader2, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTeamDashboard } from "@/hooks/useTeamDashboard"
import { Emergency, EmergencyStatus } from "@/types/emergency"
import { formatDistanceToNow } from "date-fns"

export function TeamView() {
  const {
    currentMission,
    allMissions,
    isLoading,
    error,
    isConnected,
    refreshData,
    updateMissionStatus,
  } = useTeamDashboard()

  const handleStatusUpdate = async (status: EmergencyStatus) => {
    if (!currentMission) return
    try {
      await updateMissionStatus(currentMission.id, status)
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const getNextStatus = (current: EmergencyStatus): EmergencyStatus | null => {
    const transitions: Record<EmergencyStatus, EmergencyStatus | null> = {
      assigned: 'en_route',
      en_route: 'on_scene',
      on_scene: 'transporting',
      transporting: 'completed',
      completed: null,
      cancelled: null,
      pending: null,
    }
    return transitions[current] || null
  }

  const getStatusButtonLabel = (status: EmergencyStatus): string => {
    const labels: Record<EmergencyStatus, string> = {
      assigned: 'Start Route',
      en_route: 'Arrived at Scene',
      on_scene: 'Start Transport',
      transporting: 'Complete Mission',
      completed: 'Completed',
      cancelled: 'Cancelled',
      pending: 'Accept',
    }
    return labels[status] || 'Update'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!currentMission) {
    return (
      <div className="space-y-8">
        <Card className="border-border/50 bg-card shadow-lg">
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Active Mission</h3>
            <p className="text-muted-foreground mb-6">
              You are currently available. New missions will appear here when assigned.
            </p>
            <Button onClick={refreshData} variant="outline">
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const elapsedTime = currentMission.createdAt
    ? formatDistanceToNow(new Date(currentMission.createdAt), { addSuffix: false })
    : "0 minutes"

  const nextStatus = getNextStatus(currentMission.status)

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

      {/* Current Mission */}
      <Card className="border-border/50 bg-gradient-to-br from-red-500/10 to-card shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-500/5 to-blue-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Current Mission</CardTitle>
                <CardDescription>
                  {currentMission.emergencyType || 'Emergency Response'} - {currentMission.severity}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className={
                currentMission.severity === 'critical'
                  ? 'border-red-500 text-red-500'
                  : currentMission.severity === 'high'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-yellow-500 text-yellow-500'
              }
            >
              {currentMission.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <MissionDetail
            icon={<Users className="h-5 w-5" />}
            label="Caller"
            value={`${currentMission.callerName} (${currentMission.callerPhone})`}
          />
          <MissionDetail
            icon={<MapPin className="h-5 w-5" />}
            label="Location"
            value={currentMission.address}
          />
          <MissionDetail
            icon={<Clock className="h-5 w-5" />}
            label="Elapsed"
            value={elapsedTime}
          />
          {currentMission.patientCount > 1 && (
            <MissionDetail
              icon={<Users className="h-5 w-5" />}
              label="Patients"
              value={`${currentMission.patientCount} patients`}
            />
          )}

          {currentMission.description && (
            <div className="p-4 rounded-lg bg-background/50 border border-border/30">
              <p className="text-xs text-muted-foreground font-medium mb-1">Description</p>
              <p className="text-sm text-foreground">{currentMission.description}</p>
            </div>
          )}

          {nextStatus && (
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => handleStatusUpdate(nextStatus)}
              >
                {getStatusButtonLabel(currentMission.status)}
              </Button>
              <Button variant="outline" className="border-border/30 bg-transparent">
                View Details
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Missions */}
      {allMissions.length > 1 && (
        <Card className="border-border/50 bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">All Active Missions</CardTitle>
            <CardDescription>{allMissions.length} missions in progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {allMissions.map((mission) => (
              <div
                key={mission.id}
                className="p-3 rounded-lg border border-border/30 hover:border-border/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {mission.emergencyType || 'Emergency'}
                    </p>
                    <p className="text-xs text-muted-foreground">{mission.address}</p>
                  </div>
                  <Badge variant="outline">{mission.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function MissionDetail({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
        <div className="text-blue-500">{icon}</div>
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
}
