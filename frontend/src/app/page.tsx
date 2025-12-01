"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { SettingsPanel } from "@/components/settings-panel"
import { DispatchView } from "@/components/dispatch-view"
import { SupervisorView } from "@/components/supervisor-view"
import { TeamView } from "@/components/team-view"
import authService from "@/services/authService"
import { Loader2 } from "lucide-react"

export default function Page() {
  const router = useRouter()
  const [currentRole, setCurrentRole] = useState("dispatch")
  const [currentSection, setCurrentSection] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        setIsAuthenticated(true)
        // Set role based on user role
        const user = authService.getUser()
        if (user?.role) {
          const roleMap: Record<string, string> = {
            dispatcher: 'dispatch',
            rescue_team: 'team',
            hospital_staff: 'supervisor',
            admin: 'admin',
          }
          const mappedRole = roleMap[user.role] || 'dispatch'
          setCurrentRole(mappedRole)
        }
      } else {
        setIsAuthenticated(false)
        router.push('/login')
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = () => {
    authService.logout()
    router.push('/login')
  }

  const renderRoleView = () => {
    switch (currentRole) {
      case "dispatch":
        return <DispatchView />
      case "supervisor":
        return <SupervisorView />
      case "team":
        return <TeamView />
      case "admin":
        return <AdminView />
      default:
        return <DispatchView />
    }
  }

  const getRoleTitle = () => {
    const titles: Record<string, string> = {
      dispatch: "Dispatch Center",
      supervisor: "Field Supervisor",
      team: "Emergency Team",
      admin: "System Admin",
    }
    return titles[currentRole] || "Dashboard"
  }

  const getSectionDescription = () => {
    const descriptions: Record<string, Record<string, string>> = {
      dispatch: {
        overview: "Manage incoming calls and dispatch units",
        "dispatch-history": "View recent dispatch actions",
        resources: "Check available resources",
      },
      supervisor: {
        teams: "Monitor all supervised teams in real-time",
        performance: "Track team performance metrics",
        map: "View teams on live map",
      },
      team: {
        mission: "Current mission details and progress",
        "team-info": "Team composition and status",
        communication: "Messages and coordination",
      },
      admin: {
        "system-status": "Overall system health and status",
        users: "User management",
        analytics: "System analytics and reports",
      },
    }
    return descriptions[currentRole]?.[currentSection] || "Real-time incident management"
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/20">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentRole={currentRole}
          currentSection={currentSection}
          onRoleChange={setCurrentRole}
          onSectionChange={setCurrentSection}
          onSettingsClick={() => setSettingsOpen(true)}
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="flex h-20 items-center justify-between px-6 lg:px-8">
              <div className="flex items-center gap-4 flex-1">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-slate-800">{getRoleTitle()}</h1>
                  <p className="text-xs text-slate-500 font-medium">{getSectionDescription()}</p>
                </div>
              </div>

              {/* Header Status */}
              <div className="hidden sm:flex items-center gap-6">
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-sm font-semibold text-slate-800">System Status</p>
                  </div>
                  <p className="text-xs text-green-600 font-medium">All Systems Operational</p>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/20">
            <div className="p-6 lg:p-8 max-w-7xl mx-auto">{renderRoleView()}</div>
          </main>
        </div>

        {/* Settings Panel */}
        <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </div>
  )
}

function AdminView() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard title="Total Users" value="156" change="+12 this month" />
        <AdminStatCard title="System Uptime" value="99.9%" change="Excellent" />
        <AdminStatCard title="Active Sessions" value="42" change="Normal load" />
        <AdminStatCard title="Data Usage" value="2.3 TB" change="Within limits" />
      </div>

      <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-slate-800 mb-2">System Administration</h3>
        <p className="text-slate-500 mb-6">Advanced system controls and analytics are available below.</p>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <AdminAction title="User Management" description="Add, edit, or remove users" />
          <AdminAction title="Permissions" description="Manage role-based access" />
          <AdminAction title="Database" description="Database maintenance tools" />
          <AdminAction title="Backup" description="System backups" />
          <AdminAction title="Logs" description="System and audit logs" />
          <AdminAction title="Reports" description="Generate system reports" />
        </div>
      </div>
    </div>
  )
}

function AdminStatCard({ title, value, change }: any) {
  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-6 border border-slate-200/60 hover:shadow-lg transition-all hover:scale-105">
      <p className="text-xs font-bold uppercase text-slate-500 mb-2">{title}</p>
      <p className="text-4xl font-bold text-slate-800 mb-1">{value}</p>
      <p className="text-xs text-slate-500">{change}</p>
    </div>
  )
}

function AdminAction({ title, description }: any) {
  return (
    <button className="p-4 rounded-lg border border-slate-200/30 hover:border-teal-500/50 hover:bg-teal-50 transition-all text-left">
      <p className="font-semibold text-sm text-slate-800 mb-1">{title}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </button>
  )
}
