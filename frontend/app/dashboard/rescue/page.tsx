"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Role, Emergency, EmergencyStatus } from "@/types";
import { api } from "@/lib/api";
import { EmergencyDetailModal } from "@/components/emergency/EmergencyDetailModal";
import { useSocket } from "@/hooks/useSocket";

export default function RescueTeamDashboard() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Emergency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const { socket } = useSocket(token);

  useEffect(() => {
    loadAssignedCases();
  }, []);

  // WebSocket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("emergency:assigned", (data: { emergency: Emergency }) => {
      setCases((prev) => [data.emergency, ...prev]);
    });

    socket.on("emergency:status-update", (data: { emergency: Emergency }) => {
      setCases((prev) =>
        prev.map((e) => (e.id === data.emergency.id ? data.emergency : e))
      );
      if (selectedEmergency?.id === data.emergency.id) {
        setSelectedEmergency(data.emergency);
      }
    });

    return () => {
      socket.off("emergency:assigned");
      socket.off("emergency:status-update");
    };
  }, [socket, selectedEmergency]);

  const handleUpdateStatus = async (status: EmergencyStatus, notes?: string) => {
    if (!selectedEmergency) return;
    try {
      await api.updateEmergencyStatus(selectedEmergency.id, { status, notes });
      await loadAssignedCases();
      setSelectedEmergency(null);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  const loadAssignedCases = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAssignedCases();
      setCases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load assigned cases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[Role.RESCUE_TEAM, Role.ADMIN]}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Dashboard - ทีมกู้ชีพ
        </h1>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">เคสที่ได้รับมอบหมาย</h2>
          {isLoading ? (
            <div className="p-8 text-center">กำลังโหลด...</div>
          ) : cases.length === 0 ? (
            <div className="p-8 text-center text-gray-500">ไม่มีเคสที่ได้รับมอบหมาย</div>
          ) : (
            <div className="space-y-4">
              {cases.map((emergency) => (
                <div
                  key={emergency.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedEmergency(emergency)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {emergency.address}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        ผู้แจ้ง: {emergency.callerName} ({emergency.callerPhone})
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        ระดับความรุนแรง: {emergency.severity}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
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

