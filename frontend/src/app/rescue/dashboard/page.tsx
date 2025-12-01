"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Users,
  RefreshCw,
  Bell,
  LogOut,
  User,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  StatCard,
  CaseCard,
  TeamCard,
  ConnectionStatus,
  EmptyState,
  DashboardSkeleton,
} from "@/components/rescue";
import { useRescueDashboard } from "@/hooks/useRescueDashboard";
import { EmergencyStatus } from "@/types/emergency";
import authService from "@/services/authService";

export default function RescueDashboardPage() {
  const router = useRouter();
  const {
    cases,
    rescueTeams,
    stats,
    isLoading,
    error,
    isConnected,
    refreshAll,
    updateCaseStatus,
  } = useRescueDashboard();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  const user = authService.getUser();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAll();
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  const handleStatusUpdate = async (id: string, status: EmergencyStatus) => {
    try {
      await updateCaseStatus(id, status);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleViewDetails = (id: string) => {
    console.log("View details:", id);
  };

  // Filter cases by tab
  const activeCases = cases.filter((c) =>
    ["assigned", "en_route", "on_scene", "transporting"].includes(c.status)
  );
  const criticalCases = cases.filter((c) => c.severity === "critical");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/20 p-6">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800">
                    Emergency Care
                  </h1>
                  <p className="text-xs text-slate-500">Rescue Dashboard</p>
                </div>
              </div>
              <ConnectionStatus isConnected={isConnected} />
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-teal-300 hover:text-teal-700"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="border-slate-200 text-slate-600 hover:bg-slate-50 relative"
              >
                <Bell className="w-4 h-4" />
                {stats.criticalCases > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium shadow-lg">
                    {stats.criticalCases}
                  </span>
                )}
              </Button>

              {/* User Menu with Logout */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-slate-100"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-sm font-medium">
                        {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-slate-700 hidden sm:inline">
                      {user?.firstName || user?.email?.split("@")[0] || "User"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-slate-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Active Missions"
            value={stats.activeMissions}
            icon={Activity}
            variant="default"
          />
          <StatCard
            title="Completed Today"
            value={stats.completedToday}
            icon={CheckCircle2}
            variant="success"
          />
          <StatCard
            title="Critical Cases"
            value={stats.criticalCases}
            icon={AlertTriangle}
            variant="critical"
          />
          <StatCard
            title="Available Teams"
            value={stats.availableTeams}
            icon={Users}
            variant="warning"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cases Section */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-4">
                <TabsList className="bg-white/80 backdrop-blur border border-slate-200/60 shadow-sm">
                  <TabsTrigger
                    value="active"
                    className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
                  >
                    Active ({activeCases.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="critical"
                    className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Critical ({criticalCases.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="active" className="mt-0">
                <ScrollArea className="h-[calc(100vh-320px)]">
                  {activeCases.length === 0 ? (
                    <EmptyState
                      title="No Active Cases"
                      description="All caught up! No active rescue missions at the moment."
                    />
                  ) : (
                    <div className="space-y-4 pr-4">
                      {activeCases.map((emergency) => (
                        <CaseCard
                          key={emergency.id}
                          emergency={emergency}
                          onStatusUpdate={handleStatusUpdate}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="critical" className="mt-0">
                <ScrollArea className="h-[calc(100vh-320px)]">
                  {criticalCases.length === 0 ? (
                    <EmptyState
                      icon={CheckCircle2}
                      title="No Critical Cases"
                      description="Great news! There are no critical emergencies right now."
                    />
                  ) : (
                    <div className="space-y-4 pr-4">
                      {criticalCases.map((emergency) => (
                        <CaseCard
                          key={emergency.id}
                          emergency={emergency}
                          onStatusUpdate={handleStatusUpdate}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Teams Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Rescue Teams</h2>
              <span className="text-sm text-slate-500 bg-white/80 px-3 py-1 rounded-full border border-slate-200/60">
                {rescueTeams.filter((t) => t.availableCapacity > 0).length}{" "}
                available
              </span>
            </div>

            <ScrollArea className="h-[calc(100vh-320px)]">
              {rescueTeams.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No Teams"
                  description="No rescue teams found."
                />
              ) : (
                <div className="space-y-3 pr-4">
                  {rescueTeams.map((team) => (
                    <TeamCard key={team.id} team={team} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </main>
    </div>
  );
}
