"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Role, Emergency, EmergencyStatus, EmergencySeverity } from "@/types";
import { api } from "@/lib/api";
import { EmergencyDetailModal } from "@/components/emergency/EmergencyDetailModal";
import { useSocket } from "@/hooks/useSocket";

export default function DispatcherDashboard() {
  const { user } = useAuth();
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    severity: "",
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const { socket } = useSocket(token);

  useEffect(() => {
    loadEmergencies();
  }, [filters]);

  // WebSocket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("emergency:new", (data: { emergency: Emergency }) => {
      setEmergencies((prev) => [data.emergency, ...prev]);
    });

    socket.on("emergency:assigned", (data: { emergency: Emergency }) => {
      setEmergencies((prev) =>
        prev.map((e) => (e.id === data.emergency.id ? data.emergency : e))
      );
    });

    socket.on("emergency:status-update", (data: { emergency: Emergency }) => {
      setEmergencies((prev) =>
        prev.map((e) => (e.id === data.emergency.id ? data.emergency : e))
      );
      if (selectedEmergency?.id === data.emergency.id) {
        setSelectedEmergency(data.emergency);
      }
    });

    return () => {
      socket.off("emergency:new");
      socket.off("emergency:assigned");
      socket.off("emergency:status-update");
    };
  }, [socket, selectedEmergency]);

  const loadEmergencies = async () => {
    try {
      setIsLoading(true);
      const response = await api.getAllEmergencies({
        ...filters,
        page: 1,
        limit: 50,
      });
      setEmergencies(response.data || []);
    } catch (error) {
      console.error("Failed to load emergencies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: EmergencyStatus) => {
    const colors: Record<string, string> = {
      [EmergencyStatus.PENDING]: "bg-yellow-100 text-yellow-800",
      [EmergencyStatus.ASSIGNED]: "bg-blue-100 text-blue-800",
      [EmergencyStatus.EN_ROUTE]: "bg-purple-100 text-purple-800",
      [EmergencyStatus.ON_SCENE]: "bg-indigo-100 text-indigo-800",
      [EmergencyStatus.TRANSPORTING]: "bg-orange-100 text-orange-800",
      [EmergencyStatus.COMPLETED]: "bg-green-100 text-green-800",
      [EmergencyStatus.CANCELLED]: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getSeverityColor = (severity: EmergencySeverity) => {
    const colors: Record<string, string> = {
      [EmergencySeverity.LOW]: "bg-green-100 text-green-800",
      [EmergencySeverity.MEDIUM]: "bg-yellow-100 text-yellow-800",
      [EmergencySeverity.HIGH]: "bg-orange-100 text-orange-800",
      [EmergencySeverity.CRITICAL]: "bg-red-100 text-red-800",
    };
    return colors[severity] || "bg-gray-100 text-gray-800";
  };

  const handleAssign = async (hospitalId?: string, rescueTeamId?: string) => {
    if (!selectedEmergency) return;
    try {
      await api.assignEmergency(selectedEmergency.id, {
        hospitalId,
        rescueTeamId,
      });
      await loadEmergencies();
      setSelectedEmergency(null);
    } catch (error) {
      console.error("Failed to assign emergency:", error);
      alert("เกิดข้อผิดพลาดในการมอบหมาย");
    }
  };

  const handleUpdateStatus = async (status: EmergencyStatus, notes?: string) => {
    if (!selectedEmergency) return;
    try {
      await api.updateEmergencyStatus(selectedEmergency.id, { status, notes });
      await loadEmergencies();
      setSelectedEmergency(null);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  return (
    <ProtectedRoute allowedRoles={[Role.DISPATCHER, Role.ADMIN]}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Dashboard - เจ้าหน้าที่ 1669
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">ตัวกรอง</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                สถานะ
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">ทั้งหมด</option>
                {Object.values(EmergencyStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ระดับความรุนแรง
              </label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">ทั้งหมด</option>
                {Object.values(EmergencySeverity).map((severity) => (
                  <option key={severity} value={severity}>
                    {severity}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">รายการเคสฉุกเฉิน</h2>
          </div>
          {isLoading ? (
            <div className="p-8 text-center">กำลังโหลด...</div>
          ) : emergencies.length === 0 ? (
            <div className="p-8 text-center text-gray-500">ไม่มีข้อมูล</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ผู้แจ้ง
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ที่อยู่
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ระดับความรุนแรง
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      วันที่
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emergencies.map((emergency) => (
                    <tr
                      key={emergency.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedEmergency(emergency)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {emergency.id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {emergency.callerName}
                        <br />
                        <span className="text-gray-500">{emergency.callerPhone}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {emergency.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                            emergency.severity
                          )}`}
                        >
                          {emergency.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            emergency.status
                          )}`}
                        >
                          {emergency.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(emergency.createdAt).toLocaleString("th-TH")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedEmergency && (
          <EmergencyDetailModal
            emergency={selectedEmergency}
            onClose={() => setSelectedEmergency(null)}
            onAssign={handleAssign}
            onUpdateStatus={handleUpdateStatus}
            canAssign={true}
            canUpdateStatus={true}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

