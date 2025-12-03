"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useRouter, usePathname } from "next/navigation";
import { Bell, LogOut, User } from "lucide-react";
import { Role } from "@/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      [Role.DISPATCHER]: "เจ้าหน้าที่ 1669",
      [Role.HOSPITAL_STAFF]: "เจ้าหน้าที่โรงพยาบาล",
      [Role.RESCUE_TEAM]: "ทีมกู้ชีพ",
      [Role.ADMIN]: "ผู้ดูแลระบบ",
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      [Role.DISPATCHER]: "bg-blue-100 text-blue-800",
      [Role.HOSPITAL_STAFF]: "bg-green-100 text-green-800",
      [Role.RESCUE_TEAM]: "bg-orange-100 text-orange-800",
      [Role.ADMIN]: "bg-purple-100 text-purple-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">EMS 1669</h1>
              </div>
              <div className="flex items-center gap-4">
                {user && (
                  <>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {user.firstName} {user.lastName}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                    <button
                      onClick={() => router.push("/dashboard/notifications")}
                      className="p-2 text-gray-400 hover:text-gray-600 relative"
                    >
                      <Bell className="h-5 w-5" />
                    </button>
                    <button
                      onClick={logout}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}

