"use client"

import { useState, useEffect, useRef } from "react"
import { 
  AlertCircle, Users, TrendingUp, Zap, Phone, Clock, MapPin, Loader2, 
  Bell, BellRing, Activity, AlertTriangle, CheckCircle2, X, ExternalLink,
  User, PhoneCall, Calendar, Navigation, FileText, Building2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDispatchDashboard } from "@/hooks/useDispatchDashboard"
import { Emergency, EmergencyStatus, EmergencySeverity } from "@/types/emergency"
import { formatDistanceToNow, format } from "date-fns"
// Thai locale - optional, will use default if not available
let thLocale: any = undefined
try {
  thLocale = require("date-fns/locale/th").default || require("date-fns/locale/th")
} catch {
  // Locale not available, will use default
}

// No external dialog needed - using custom modal

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

  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newEmergencyCount, setNewEmergencyCount] = useState(0)
  const previousEmergencyCount = useRef(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Play sound when new emergency arrives
  useEffect(() => {
    if (pendingEmergencies.length > previousEmergencyCount.current) {
      const newCount = pendingEmergencies.length - previousEmergencyCount.current
      setNewEmergencyCount(newCount)
      
      // Play notification sound
      try {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {
            // Ignore autoplay restrictions
          })
        }
      } catch (e) {
        // Ignore audio errors
      }

      // Reset notification after 3 seconds
      setTimeout(() => setNewEmergencyCount(0), 3000)
    }
    previousEmergencyCount.current = pendingEmergencies.length
  }, [pendingEmergencies.length])

  const handleAssign = async (emergencyId: string, rescueTeamId?: string, hospitalId?: string) => {
    try {
      await assignEmergency(emergencyId, hospitalId, rescueTeamId)
      setIsModalOpen(false)
      // Show success message (you can add toast notification here)
      console.log('มอบหมายงานสำเร็จ')
    } catch (err: any) {
      console.error('Failed to assign:', err)
      // Show error message to user
      alert(err.message || 'ไม่สามารถมอบหมายงานได้ กรุณาลองใหม่อีกครั้ง')
    }
  }

  const handleEmergencyClick = (emergency: Emergency) => {
    setSelectedEmergency(emergency)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Audio element for notifications - optional, will fail silently if file doesn't exist */}
      <audio ref={audioRef} preload="auto" style={{ display: 'none' }}>
        <source src="/notification.mp3" type="audio/mpeg" />
      </audio>

      {/* New Emergency Notification Banner */}
      {newEmergencyCount > 0 && (
        <div className="animate-in slide-in-from-top-5 duration-500">
          <Card className="border-red-500/50 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 animate-pulse">
                  <BellRing className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-red-700 dark:text-red-400">
                    SOS ใหม่! {newEmergencyCount} รายการ
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    มีคำขอความช่วยเหลือใหม่เข้ามาในระบบ
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNewEmergencyCount(0)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Connection Status */}
      {!isConnected && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200 text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          WebSocket disconnected - Real-time updates unavailable
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Dispatch Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="คิวรอรับเรื่อง"
          value={stats.callsInQueue.toString()}
          icon={<AlertCircle className="h-6 w-6" />}
          color="bg-red-500"
          trend={`${stats.criticalCalls} รายการวิกฤต`}
          gradient="from-red-500/10 to-red-600/5"
        />
        <StatCard
          title="หน่วยที่ส่งแล้ว"
          value={stats.dispatchedUnits.toString()}
          icon={<Users className="h-6 w-6" />}
          color="bg-blue-500"
          trend="กำลังปฏิบัติการ"
          gradient="from-blue-500/10 to-blue-600/5"
        />
        <StatCard
          title="เวลาตอบสนอง"
          value={stats.avgResponseTime}
          icon={<TrendingUp className="h-6 w-6" />}
          color="bg-green-500"
          trend="เวลาเฉลี่ย"
          gradient="from-green-500/10 to-green-600/5"
        />
        <StatCard
          title="ภาระงานระบบ"
          value={`${Math.round((stats.dispatchedUnits / (rescueTeams.length || 1)) * 100)}%`}
          icon={<Activity className="h-6 w-6" />}
          color="bg-yellow-500"
          trend="ระดับปานกลาง"
          gradient="from-yellow-500/10 to-yellow-600/5"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Call Queue */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 shadow-lg">
                    <Phone className="h-7 w-7 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">คิวรับเรื่อง SOS</CardTitle>
                    <CardDescription className="text-sm">
                      {pendingEmergencies.length} รายการรอ - เรียงตามความรุนแรง
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={refreshData}
                  className="hover:bg-primary/10"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  รีเฟรช
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-3 max-h-[600px] overflow-y-auto">
              {pendingEmergencies.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Phone className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">ไม่มีรายการรอ</p>
                  <p className="text-sm">ระบบพร้อมรับ SOS ใหม่</p>
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
                  .map((emergency, index) => (
                    <CallItem
                      key={emergency.id}
                      emergency={emergency}
                      onAssign={handleAssign}
                      onViewDetails={handleEmergencyClick}
                      rescueTeams={rescueTeams}
                      hospitals={hospitals}
                      index={index}
                    />
                  ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Status */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-card shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b">
              <CardTitle className="text-lg font-bold">การดำเนินการด่วน</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={refreshData}
              >
                <Clock className="h-4 w-4 mr-2" />
                รีเฟรชคิว
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={() => window.open('/rescue/dashboard', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                ดูแดชบอร์ด
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-border/50 bg-card shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b">
              <CardTitle className="text-lg font-bold">สถานะระบบ</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-sm font-medium">WebSocket</span>
                </div>
                <Badge variant={isConnected ? "default" : "destructive"}>
                  {isConnected ? "เชื่อมต่อ" : "ตัดการเชื่อมต่อ"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">หน่วยกู้ภัย</span>
                </div>
                <Badge variant="outline">{rescueTeams.length} หน่วย</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">โรงพยาบาล</span>
                </div>
                <Badge variant="outline">{hospitals.length} แห่ง</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Emergency Detail Modal */}
      <EmergencyDetailModal
        emergency={selectedEmergency}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssign={handleAssign}
        rescueTeams={rescueTeams}
        hospitals={hospitals}
      />
    </div>
  )
}

function StatCard({ title, value, icon, color, trend, gradient }: any) {
  return (
    <Card className="border-border/50 bg-gradient-to-br from-card via-card to-secondary/50 hover:shadow-xl transition-all hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{title}</p>
            <p className="text-4xl font-bold text-foreground mb-1">{value}</p>
            <p className="text-xs text-muted-foreground">{trend}</p>
          </div>
          <div className={`p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-md`}>
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
  onViewDetails,
  rescueTeams,
  hospitals,
  index,
}: {
  emergency: Emergency
  onAssign: (emergencyId: string, rescueTeamId?: string, hospitalId?: string) => void
  onViewDetails: (emergency: Emergency) => void
  rescueTeams: any[]
  hospitals: any[]
  index: number
}) {
  const severityConfig: Record<EmergencySeverity, { color: string; bg: string; label: string }> = {
    critical: { 
      color: "bg-red-500", 
      bg: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
      label: "วิกฤต"
    },
    high: { 
      color: "bg-orange-500", 
      bg: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800",
      label: "สูง"
    },
    medium: { 
      color: "bg-yellow-500", 
      bg: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
      label: "ปานกลาง"
    },
    low: { 
      color: "bg-green-500", 
      bg: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
      label: "ต่ำ"
    },
  }

  const config = severityConfig[emergency.severity]
  const waitTime = emergency.createdAt
    ? formatDistanceToNow(new Date(emergency.createdAt), { 
        addSuffix: true, 
        ...(thLocale ? { locale: thLocale } : {})
      })
    : "เมื่อสักครู่"

  const availableTeams = rescueTeams.filter(t => t.availableCapacity > 0)
  const availableHospitals = hospitals.filter(h => h.availableCapacity > 0)

  return (
    <div 
      className={`p-5 rounded-xl border-2 ${config.bg} hover:shadow-lg transition-all cursor-pointer animate-in fade-in slide-in-from-right-4`}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => onViewDetails(emergency)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={`w-4 h-4 rounded-full ${config.color} animate-pulse mt-1`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <p className="font-bold text-base text-foreground line-clamp-2">{emergency.description}</p>
              <Badge 
                variant="outline" 
                className={`text-xs font-semibold ${config.color.replace('bg-', 'border-')} ${config.color.replace('bg-', 'text-')}`}
              >
                {config.label}
              </Badge>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{emergency.address}</span>
              </p>
              {emergency.callerName && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{emergency.callerName}</span>
                  {emergency.callerPhone && (
                    <>
                      <span className="mx-1">•</span>
                      <PhoneCall className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{emergency.callerPhone}</span>
                    </>
                  )}
                </p>
              )}
              {emergency.emergencyType && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3 w-3 flex-shrink-0" />
                  <span>{emergency.emergencyType}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="text-right ml-4 flex-shrink-0">
          <p className="text-sm font-bold text-foreground mb-1">{waitTime}</p>
          <Badge variant="secondary" className="text-xs">
            {format(new Date(emergency.createdAt), "HH:mm", 
              thLocale ? { locale: thLocale } : {}
            )}
          </Badge>
        </div>
      </div>
      
      {(availableTeams.length > 0 || availableHospitals.length > 0) && (
        <div className="flex gap-2 mt-4 flex-wrap" onClick={(e) => e.stopPropagation()}>
          {availableTeams.slice(0, 2).map((team) => (
            <Button
              key={team.id}
              size="sm"
              className="bg-blue-500 text-white hover:bg-blue-600 text-xs h-8"
              onClick={(e) => {
                e.stopPropagation()
                onAssign(emergency.id, team.id)
              }}
            >
              ส่ง {team.name}
            </Button>
          ))}
          {availableHospitals.slice(0, 1).map((hospital) => (
            <Button
              key={hospital.id}
              size="sm"
              variant="outline"
              className="text-xs h-8"
              onClick={(e) => {
                e.stopPropagation()
                onAssign(emergency.id, undefined, hospital.id)
              }}
            >
              ส่ง {hospital.name}
            </Button>
          ))}
          <Button
            size="sm"
            variant="ghost"
            className="text-xs h-8"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails(emergency)
            }}
          >
            ดูรายละเอียด →
          </Button>
        </div>
      )}
    </div>
  )
}

function EmergencyDetailModal({
  emergency,
  isOpen,
  onClose,
  onAssign,
  rescueTeams,
  hospitals,
}: {
  emergency: Emergency | null
  isOpen: boolean
  onClose: () => void
  onAssign: (emergencyId: string, rescueTeamId?: string, hospitalId?: string) => void
  rescueTeams: any[]
  hospitals: any[]
}) {
  if (!emergency || !isOpen) return null

  const severityConfig: Record<EmergencySeverity, { color: string; label: string }> = {
    critical: { color: "text-red-500", label: "วิกฤต" },
    high: { color: "text-orange-500", label: "สูง" },
    medium: { color: "text-yellow-500", label: "ปานกลาง" },
    low: { color: "text-green-500", label: "ต่ำ" },
  }

  const config = severityConfig[emergency.severity]
  const availableTeams = rescueTeams.filter(t => t.availableCapacity > 0)
  const availableHospitals = hospitals.filter(h => h.availableCapacity > 0)

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl shadow-2xl w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto z-50">
        <div className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border/30 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">รายละเอียด SOS</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6">

          <div className="space-y-6">
            {/* Emergency Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${config.color.replace('text-', 'bg-')}/10`}>
                  <AlertCircle className={`h-6 w-6 ${config.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{emergency.description}</h3>
                  <Badge className={`mt-1 ${config.color.replace('text-', 'bg-')}`}>
                    {config.label}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>ผู้แจ้ง</span>
                  </div>
                  <p className="font-medium">{emergency.callerName || "ไม่ระบุ"}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <PhoneCall className="h-4 w-4" />
                    <span>เบอร์โทร</span>
                  </div>
                  <p className="font-medium">{emergency.callerPhone || "ไม่ระบุ"}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>ที่อยู่</span>
                  </div>
                  <p className="font-medium">{emergency.address}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>เวลาแจ้ง</span>
                  </div>
                  <p className="font-medium">
                    {format(new Date(emergency.createdAt), "dd MMM yyyy HH:mm", 
                      thLocale ? { locale: thLocale } : {}
                    )}
                  </p>
                </div>
              </div>

              {emergency.notes && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>หมายเหตุ</span>
                  </div>
                  <p className="text-sm bg-muted p-3 rounded-lg">{emergency.notes}</p>
                </div>
              )}

              {emergency.location && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Navigation className="h-4 w-4" />
                    <span>พิกัด</span>
                  </div>
                  <p className="text-sm font-mono">
                    {emergency.location.coordinates[1]}, {emergency.location.coordinates[0]}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const [lng, lat] = emergency.location.coordinates
                      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    เปิดใน Google Maps
                  </Button>
                </div>
              )}
            </div>

            {/* Assignment Section */}
            <div className="border-t pt-6 space-y-4">
              <h4 className="font-bold text-lg">มอบหมายงาน</h4>
              
              {availableTeams.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">หน่วยกู้ภัย</p>
                  <div className="flex flex-wrap gap-2">
                    {availableTeams.map((team) => (
                      <Button
                        key={team.id}
                        size="sm"
                        className="bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => onAssign(emergency.id, team.id)}
                      >
                        ส่ง {team.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {availableHospitals.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">โรงพยาบาล</p>
                  <div className="flex flex-wrap gap-2">
                    {availableHospitals.map((hospital) => (
                      <Button
                        key={hospital.id}
                        size="sm"
                        variant="outline"
                        onClick={() => onAssign(emergency.id, undefined, hospital.id)}
                      >
                        ส่ง {hospital.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {availableTeams.length === 0 && availableHospitals.length === 0 && (
                <p className="text-sm text-muted-foreground">ไม่มีหน่วยงานพร้อมใช้งาน</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
