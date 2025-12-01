"use client"
import {
  Users,
  Settings,
  LogOut,
  X,
  RadioTower,
  Map,
  AlertCircle,
  BarChart3,
  Shield,
  Clock,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  currentRole: string
  currentSection: string
  onRoleChange: (role: string) => void
  onSectionChange: (section: string) => void
  onSettingsClick: () => void
  onLogout?: () => void
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({
  currentRole,
  currentSection,
  onRoleChange,
  onSectionChange,
  onSettingsClick,
  onLogout,
  isOpen = true,
  onClose,
}: SidebarProps) {
  const roles = [
    {
      id: "dispatch",
      label: "Dispatch Center",
      icon: <RadioTower className="h-5 w-5" />,
      description: "Call handling & routing",
    },
    {
      id: "supervisor",
      label: "Field Supervisor",
      icon: <Shield className="h-5 w-5" />,
      description: "Team oversight",
    },
    {
      id: "team",
      label: "Emergency Team",
      icon: <Users className="h-5 w-5" />,
      description: "Mission details",
    },
    {
      id: "admin",
      label: "System Admin",
      icon: <BarChart3 className="h-5 w-5" />,
      description: "System control",
    },
  ]

  const menuSections = {
    dispatch: [
      { id: "overview", label: "Call Queue", icon: <AlertCircle className="h-4 w-4" /> },
      { id: "dispatch-history", label: "Dispatch History", icon: <Clock className="h-4 w-4" /> },
      { id: "resources", label: "Resources", icon: <Activity className="h-4 w-4" /> },
    ],
    supervisor: [
      { id: "teams", label: "Team Status", icon: <Users className="h-4 w-4" /> },
      { id: "performance", label: "Performance", icon: <BarChart3 className="h-4 w-4" /> },
      { id: "map", label: "Live Map", icon: <Map className="h-4 w-4" /> },
    ],
    team: [
      { id: "mission", label: "Current Mission", icon: <AlertCircle className="h-4 w-4" /> },
      { id: "team-info", label: "Team Info", icon: <Users className="h-4 w-4" /> },
      { id: "communication", label: "Communications", icon: <Activity className="h-4 w-4" /> },
    ],
    admin: [
      { id: "system-status", label: "System Status", icon: <Activity className="h-4 w-4" /> },
      { id: "users", label: "Users", icon: <Users className="h-4 w-4" /> },
      { id: "analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
    ],
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-white to-slate-50 border-r border-slate-200/60 overflow-y-auto transition-all duration-300 z-30 md:relative md:translate-x-0 shadow-lg ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-200/60 p-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">EOC System</h2>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-slate-500">Emergency Operations</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Role Selector */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Your Role</p>
            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    onRoleChange(role.id)
                    onSectionChange("overview")
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    currentRole === role.id
                      ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/25"
                      : "bg-transparent text-slate-700 hover:bg-teal-50 border border-transparent hover:border-teal-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {role.icon}
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{role.label}</p>
                      <p className={`text-xs ${currentRole === role.id ? "text-white/80" : "text-slate-500"}`}>
                        {role.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Menu Sections */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 px-3">Navigation</p>
            <div className="space-y-1">
              {menuSections[currentRole as keyof typeof menuSections]?.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 ${
                    currentSection === item.id
                      ? "bg-teal-100 text-teal-700 border border-teal-300"
                      : "text-slate-600 hover:text-slate-800 hover:bg-teal-50"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Settings & Logout */}
          <div className="pt-6 border-t border-slate-200/60 space-y-2">
            <button
              onClick={onSettingsClick}
              className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              onClick={onLogout}
              className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
