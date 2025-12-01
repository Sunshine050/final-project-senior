"use client"

import { useState } from "react"
import { X, Save, AlertCircle, Bell, Lock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [settings, setSettings] = useState({
    criticalAlerts: true,
    soundNotifications: true,
    darkMode: false,
    autoDispatch: false,
    teamVisibility: "all",
  })

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />}

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-screen w-full sm:w-96 bg-card border-l border-border/50 shadow-2xl overflow-y-auto transition-all duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border/30 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Settings</h2>
            <p className="text-xs text-muted-foreground mt-1">Customize your system preferences</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Notifications Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <p className="text-xs text-muted-foreground">Alert preferences</p>
              </div>
            </div>

            <label className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:border-border/50 cursor-pointer transition-colors">
              <div>
                <p className="font-medium text-sm text-foreground">Critical Alerts</p>
                <p className="text-xs text-muted-foreground">Emergency notifications only</p>
              </div>
              <input
                type="checkbox"
                checked={settings.criticalAlerts}
                onChange={(e) => setSettings({ ...settings, criticalAlerts: e.target.checked })}
                className="w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:border-border/50 cursor-pointer transition-colors">
              <div>
                <p className="font-medium text-sm text-foreground">Sound Notifications</p>
                <p className="text-xs text-muted-foreground">Play alert sounds</p>
              </div>
              <input
                type="checkbox"
                checked={settings.soundNotifications}
                onChange={(e) => setSettings({ ...settings, soundNotifications: e.target.checked })}
                className="w-4 h-4"
              />
            </label>
          </div>

          {/* System Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">System</h3>
                <p className="text-xs text-muted-foreground">Core functionality settings</p>
              </div>
            </div>

            <label className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:border-border/50 cursor-pointer transition-colors">
              <div>
                <p className="font-medium text-sm text-foreground">Auto-Dispatch</p>
                <p className="text-xs text-muted-foreground">Automatically assign units</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoDispatch}
                onChange={(e) => setSettings({ ...settings, autoDispatch: e.target.checked })}
                className="w-4 h-4"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Team Visibility</label>
              <select
                value={settings.teamVisibility}
                onChange={(e) => setSettings({ ...settings, teamVisibility: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border/30 bg-background text-foreground text-sm focus:border-primary/50 focus:outline-none"
              >
                <option value="all">All Teams</option>
                <option value="assigned">Assigned Teams Only</option>
                <option value="nearby">Nearby Teams</option>
              </select>
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Security</h3>
                <p className="text-xs text-muted-foreground">Access & privacy</p>
              </div>
            </div>

            <Button className="w-full bg-primary text-white hover:bg-primary/90">Change Password</Button>

            <Button variant="outline" className="w-full border-border/30 bg-transparent">
              Two-Factor Authentication
            </Button>
          </div>

          {/* Info Alert */}
          <div className="flex gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Changes are saved automatically. Contact your administrator for system-wide settings.
            </p>
          </div>

          {/* Save Button */}
          <Button className="w-full bg-primary text-white hover:bg-primary/90 h-11 font-semibold gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </>
  )
}
