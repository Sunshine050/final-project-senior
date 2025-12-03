"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Role } from "@/types";
import { Building2, Users, Activity } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <ProtectedRoute allowedRoles={[Role.ADMIN]}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Dashboard - ผู้ดูแลระบบ
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => router.push("/dashboard/admin/organizations")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">จัดการองค์กร</h3>
                <p className="text-sm text-gray-600">โรงพยาบาล, ทีมกู้ชีพ, ศูนย์สั่งการ</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push("/dashboard/dispatcher")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">ดูเคสฉุกเฉิน</h3>
                <p className="text-sm text-gray-600">รายการเคสทั้งหมด</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

