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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 select-none">
          Dashboard - เจ้าหน้าที่ 1669
        </h1>

        {/* Filters */}
        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-5 text-gray-700 select-none">ตัวกรอง</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="statusFilter"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                สถานะ
              </label>
              <select
                id="statusFilter"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition duration-150 ease-in-out"
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
              <label
                htmlFor="severityFilter"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                ระดับความรุนแรง
              </label>
              <select
                id="severityFilter"
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition duration-150 ease-in-out"
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
        </section>

        {/* Emergency List */}
        <section className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 select-none">รายการเคสฉุกเฉิน</h2>
            <button
              onClick={loadEmergencies}
              className="text-blue-600 hover:text-blue-800 transition rounded-md px-3 py-1
              border border-blue-600 hover:border-blue-800 font-medium select-none"
              aria-label="รีเฟรชข้อมูลเคส"
              title="รีเฟรชข้อมูลเคส"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mx-auto text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  />
                </svg>
              ) : (
                "รีเฟรช"
              )}
            </button>
          </div>

          {isLoading ? (
            <div className="p-12 flex justify-center items-center text-gray-500 space-x-2 select-none">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                />
              </svg>
              <span className="text-lg font-medium">กำลังโหลดข้อมูล...</span>
            </div>
          ) : emergencies.length === 0 ? (
            <div className="p-12 text-center text-gray-400 select-none">
              ไม่มีเคสฉุกเฉินในขณะนี้
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-blue-400 scrollbar-track-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50 sticky top-0 z-10">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider select-none"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider select-none"
                    >
                      ผู้แจ้ง
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider select-none"
                    >
                      ที่อยู่
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider select-none"
                    >
                      ระดับความรุนแรง
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider select-none"
                    >
                      สถานะ
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider select-none"
                    >
                      วันที่
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emergencies.map((emergency) => (
                    <tr
                      key={emergency.id}
                      className="hover:bg-blue-50 cursor-pointer transition"
                      onClick={() => setSelectedEmergency(emergency)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setSelectedEmergency(emergency);
                      }}
                      aria-label={`ดูรายละเอียดเคส ${emergency.id.slice(-8)}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{emergency.id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-semibold">{emergency.callerName}</div>
                        <div className="text-gray-500 text-xs select-text">{emergency.callerPhone}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-900" title={emergency.address}>
                        {emergency.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getSeverityColor(
                            emergency.severity
                          )}`}
                        >
                          {emergency.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
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
        </section>

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
