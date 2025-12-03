"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Role, Emergency, EmergencyStatus } from "@/types";
import { api } from "@/lib/api";
import { EmergencyDetailModal } from "@/components/emergency/EmergencyDetailModal";
import { BedManagementForm } from "@/components/dashboard/BedManagementForm";
import { useSocket } from "@/hooks/useSocket";

export default function HospitalDashboard() {
  const { user } = useAuth();
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);
  const [showBedManagement, setShowBedManagement] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const { socket } = useSocket(token);

  useEffect(() => {
    loadActiveEmergencies();
  }, []);

  // WebSocket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("emergency:assigned", (data: { emergency: Emergency }) => {
      setEmergencies((prev) => [data.emergency, ...prev]);
    });

    socket.on("emergency:status-update", (data: { emergency: Emergency }) => {
      setEmergencies((prev) =>
        prev.map((e) => (e.id === data.emergency.id ? data.emergency : e))
      );
      if (selectedEmergency?.id === data.emergency.id) {
        setSelectedEmergency(data.emergency);
      }
    });

    socket.on("hospital:bed-update", () => {
      // Refresh if needed
    });

    return () => {
      socket.off("emergency:assigned");
      socket.off("emergency:status-update");
      socket.off("hospital:bed-update");
    };
  }, [socket, selectedEmergency]);

  const handleUpdateStatus = async (status: EmergencyStatus, notes?: string) => {
    if (!selectedEmergency) return;
    try {
      await api.updateEmergencyStatus(selectedEmergency.id, { status, notes });
      await loadActiveEmergencies();
      setSelectedEmergency(null);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  const loadActiveEmergencies = async () => {
    try {
      setIsLoading(true);
      const data = await api.getActiveEmergencies();
      setEmergencies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load active emergencies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[Role.HOSPITAL_STAFF, Role.ADMIN]}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard - โรงพยาบาล</h1>
          {user?.organizationId && (
            <button
              onClick={() => setShowBedManagement(!showBedManagement)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              จัดการเตียง
            </button>
          )}
        </div>

        {showBedManagement && user?.organizationId && (
          <div className="mb-6">
            <BedManagementForm
              hospitalId={user.organizationId}
              onUpdate={() => setShowBedManagement(false)}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">เคสฉุกเฉินที่กำลังดำเนินการ</h2>
          {isLoading ? (
            <div className="p-8 text-center">กำลังโหลด...</div>
          ) : emergencies.length === 0 ? (
            <div className="p-8 text-center text-gray-500">ไม่มีเคสที่กำลังดำเนินการ</div>
          ) : (
            <div className="space-y-4">
              {emergencies.map((emergency) => (
                <div
                  key={emergency.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedEmergency(emergency)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {emergency.callerName}
                      </h3>
                      <p className="text-sm text-gray-600">{emergency.address}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        ผู้ป่วย: {emergency.patientCount} คน
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {emergency.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedEmergency && (
          <EmergencyDetailModal
            emergency={selectedEmergency}
            onClose={() => setSelectedEmergency(null)}
            onUpdateStatus={handleUpdateStatus}
            canUpdateStatus={true}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

