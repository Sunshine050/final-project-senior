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
    // ปรับเป็นสีเข้มขึ้นและ text สีขาว เพื่อ readability ดีขึ้น
    const colors: Record<string, string> = {
      [Role.DISPATCHER]: "bg-blue-600 text-white",
      [Role.HOSPITAL_STAFF]: "bg-green-600 text-white",
      [Role.RESCUE_TEAM]: "bg-orange-600 text-white",
      [Role.ADMIN]: "bg-purple-700 text-white",
    };
    return colors[role] || "bg-gray-600 text-white";
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white border-b border-gray-300 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <h1 className="text-2xl font-extrabold text-gray-900 select-none">
                  EMS 1669
                </h1>
              </div>
              <div className="flex items-center gap-5">
                {user && (
                  <>
                    <div className="flex items-center gap-3">
                      <User className="h-6 w-6 text-gray-600" />
                      <span className="text-base font-medium text-gray-800 select-text">
                        {user.firstName} {user.lastName}
                      </span>
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${getRoleColor(
                          user.role
                        )}`}
                        title={getRoleLabel(user.role)}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                    <button
                      onClick={() => router.push("/dashboard/notifications")}
                      className="relative p-2 rounded-md text-gray-600 hover:text-gray-900
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="แจ้งเตือน"
                    >
                      <Bell className="h-6 w-6" />
                      {/* TODO: ถ้ามีแจ้งเตือนใหม่ สามารถเพิ่ม badge ตรงนี้ */}
                    </button>
                    <button
                      onClick={logout}
                      className="p-2 rounded-md text-gray-600 hover:text-gray-900
                      focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      aria-label="ออกจากระบบ"
                    >
                      <LogOut className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
