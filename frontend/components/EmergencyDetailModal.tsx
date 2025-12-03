"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Emergency, EmergencyStatus, EmergencySeverity } from "@/types";
import { api } from "@/lib/api";

interface EmergencyDetailModalProps {
  emergency: Emergency | null;
  onClose: () => void;
  onAssign?: (hospitalId?: string, rescueTeamId?: string) => void;
  onUpdateStatus?: (status: EmergencyStatus, notes?: string) => void;
  canAssign?: boolean;
  canUpdateStatus?: boolean;
}

export function EmergencyDetailModal({
  emergency,
  onClose,
  onAssign,
  onUpdateStatus,
  canAssign = false,
  canUpdateStatus = false,
}: EmergencyDetailModalProps) {
  useEffect(() => {
    console.log("[EmergencyDetailModal] Component mounted/updated:", {
      emergencyId: emergency?.id,
      status: emergency?.status,
      canAssign,
      canUpdateStatus,
    });
  }, [emergency, canAssign, canUpdateStatus]);

  if (!emergency) {
    console.log("[EmergencyDetailModal] No emergency data, returning null");
    return null;
  }

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

  console.log("[EmergencyDetailModal] Render:", {
    emergencyId: emergency.id,
    status: emergency.status,
    severity: emergency.severity,
    patientCount: emergency.patientCount,
    patients: emergency.patients,
    patientsType: typeof emergency.patients,
    isPatientsArray: Array.isArray(emergency.patients),
    patientsLength: Array.isArray(emergency.patients)
      ? emergency.patients.length
      : "N/A",
    hasAssignedHospital: !!emergency.assignedHospital,
    hasAssignedRescueTeam: !!emergency.assignedRescueTeam,
    canAssign,
    canUpdateStatus,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            รายละเอียดเคสฉุกเฉิน
          </h2>
          <button
            onClick={() => {
              console.log(
                "[EmergencyDetailModal] Close button clicked, emergencyId:",
                emergency.id
              );
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status & Severity */}
          <div className="flex gap-4">
            <div>
              <span className="text-sm text-gray-600">สถานะ:</span>
              <span
                className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  emergency.status
                )}`}
              >
                {emergency.status}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-600">ระดับความรุนแรง:</span>
              <span
                className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(
                  emergency.severity
                )}`}
              >
                {emergency.severity}
              </span>
            </div>
          </div>

          {/* Caller Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">ข้อมูลผู้แจ้ง</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p>
                <span className="text-gray-600">ชื่อ:</span>{" "}
                {emergency.callerName}
              </p>
              <p>
                <span className="text-gray-600">เบอร์โทร:</span>{" "}
                {emergency.callerPhone}
              </p>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              สถานที่เกิดเหตุ
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900">{emergency.address}</p>
              {emergency.latitude && emergency.longitude && (
                <p className="text-sm text-gray-600 mt-1">
                  พิกัด: {emergency.latitude}, {emergency.longitude}
                </p>
              )}
            </div>
          </div>

          {/* Patients */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              ข้อมูลผู้ป่วย ({emergency.patientCount || 0} คน)
            </h3>
            <div className="space-y-2">
              {Array.isArray(emergency.patients) &&
              emergency.patients.length > 0 ? (
                emergency.patients.map((patient, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">
                      {patient.name || "ไม่ทราบชื่อ"}
                    </p>
                    <div className="text-sm text-gray-600 mt-1 space-x-4">
                      {patient.age && <span>อายุ: {patient.age} ปี</span>}
                      {patient.gender && <span>เพศ: {patient.gender}</span>}
                      {patient.condition && (
                        <span>อาการ: {patient.condition}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-gray-500 text-sm">
                  ไม่มีข้อมูลผู้ป่วย
                </div>
              )}
            </div>
          </div>

          {/* Description & Notes */}
          {emergency.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">รายละเอียด</h3>
              <p className="text-gray-700">{emergency.description}</p>
            </div>
          )}

          {emergency.notes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">หมายเหตุ</h3>
              <p className="text-gray-700">{emergency.notes}</p>
            </div>
          )}

          {/* Assigned Organizations */}
          {(emergency.assignedHospital || emergency.assignedRescueTeam) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                หน่วยงานที่รับผิดชอบ
              </h3>
              <div className="space-y-2">
                {emergency.assignedHospital && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="font-medium text-blue-900">
                      โรงพยาบาล: {emergency.assignedHospital.name}
                    </p>
                    {emergency.assignedHospital.phone && (
                      <p className="text-sm text-blue-700">
                        โทร: {emergency.assignedHospital.phone}
                      </p>
                    )}
                  </div>
                )}
                {emergency.assignedRescueTeam && (
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="font-medium text-orange-900">
                      ทีมกู้ชีพ: {emergency.assignedRescueTeam.name}
                    </p>
                    {emergency.assignedRescueTeam.phone && (
                      <p className="text-sm text-orange-700">
                        โทร: {emergency.assignedRescueTeam.phone}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="text-sm text-gray-500 border-t pt-4">
            <p>
              สร้างเมื่อ:{" "}
              {new Date(emergency.createdAt).toLocaleString("th-TH")}
            </p>
            <p>
              อัปเดตล่าสุด:{" "}
              {new Date(emergency.updatedAt).toLocaleString("th-TH")}
            </p>
          </div>
        </div>

        {/* Actions */}
        {(canAssign || canUpdateStatus) && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
            {canAssign && onAssign && (
              <AssignEmergencyForm
                emergencyId={emergency.id}
                onAssign={onAssign}
              />
            )}
            {canUpdateStatus && onUpdateStatus && (
              <UpdateStatusForm
                currentStatus={emergency.status}
                onUpdate={onUpdateStatus}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Assign Emergency Form Component
function AssignEmergencyForm({
  emergencyId,
  onAssign,
}: {
  emergencyId: string;
  onAssign: (hospitalId?: string, rescueTeamId?: string) => void;
}) {
  const [hospitalId, setHospitalId] = useState("");
  const [rescueTeamId, setRescueTeamId] = useState("");
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [rescueTeams, setRescueTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(
      "[AssignEmergencyForm] Component mounted, emergencyId:",
      emergencyId
    );
    loadOptions();
  }, []);

  useEffect(() => {
    console.log("[AssignEmergencyForm] State changed:", {
      hospitalId,
      rescueTeamId,
      hospitalsCount: hospitals.length,
      rescueTeamsCount: rescueTeams.length,
      isLoading,
    });
  }, [hospitalId, rescueTeamId, hospitals, rescueTeams, isLoading]);

  const loadOptions = async () => {
    try {
      console.log(
        "[AssignEmergencyForm] loadOptions: Starting to load hospitals and rescue teams"
      );
      const [hospitalsData, rescueTeamsData] = await Promise.all([
        api.getHospitals(),
        api.getRescueTeams(),
      ]);
      console.log("[AssignEmergencyForm] loadOptions: Received data:", {
        hospitalsData,
        rescueTeamsData,
      });
      // Handle both array and object with data property
      const hospitalsList = Array.isArray(hospitalsData)
        ? hospitalsData
        : Array.isArray(hospitalsData?.data)
        ? hospitalsData.data
        : [];
      const rescueTeamsList = Array.isArray(rescueTeamsData)
        ? rescueTeamsData
        : Array.isArray(rescueTeamsData?.data)
        ? rescueTeamsData.data
        : [];
      console.log("[AssignEmergencyForm] loadOptions: Processed lists:", {
        hospitalsCount: hospitalsList.length,
        rescueTeamsCount: rescueTeamsList.length,
      });
      setHospitals(hospitalsList);
      setRescueTeams(rescueTeamsList);
      console.log(
        "[AssignEmergencyForm] loadOptions: Successfully loaded options"
      );
    } catch (error) {
      console.error(
        "[AssignEmergencyForm] loadOptions: Failed to load options:",
        error
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[AssignEmergencyForm] handleSubmit: Form submitted:", {
      emergencyId,
      hospitalId: hospitalId || "none",
      rescueTeamId: rescueTeamId || "none",
    });
    setIsLoading(true);
    try {
      await onAssign(hospitalId || undefined, rescueTeamId || undefined);
      console.log(
        "[AssignEmergencyForm] handleSubmit: Successfully assigned emergency"
      );
    } catch (error) {
      console.error(
        "[AssignEmergencyForm] handleSubmit: Failed to assign emergency:",
        error
      );
    } finally {
      setIsLoading(false);
      console.log("[AssignEmergencyForm] handleSubmit: Loading completed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <div className="flex gap-3">
        <select
          value={hospitalId}
          onChange={(e) => {
            const newValue = e.target.value;
            console.log(
              "[AssignEmergencyForm] Hospital selected:",
              newValue || "none"
            );
            setHospitalId(newValue);
          }}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">เลือกโรงพยาบาล</option>
          {hospitals.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name}
            </option>
          ))}
        </select>
        <select
          value={rescueTeamId}
          onChange={(e) => {
            const newValue = e.target.value;
            console.log(
              "[AssignEmergencyForm] Rescue team selected:",
              newValue || "none"
            );
            setRescueTeamId(newValue);
          }}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">เลือกทีมกู้ชีพ</option>
          {rescueTeams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isLoading || (!hospitalId && !rescueTeamId)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "กำลังส่ง..." : "มอบหมาย"}
        </button>
      </div>
    </form>
  );
}

// Update Status Form Component
function UpdateStatusForm({
  currentStatus,
  onUpdate,
}: {
  currentStatus: EmergencyStatus;
  onUpdate: (status: EmergencyStatus, notes?: string) => void;
}) {
  const getNextStatuses = (current: EmergencyStatus): EmergencyStatus[] => {
    const flow: Record<EmergencyStatus, EmergencyStatus[]> = {
      [EmergencyStatus.PENDING]: [
        EmergencyStatus.ASSIGNED,
        EmergencyStatus.CANCELLED,
      ],
      [EmergencyStatus.ASSIGNED]: [
        EmergencyStatus.EN_ROUTE,
        EmergencyStatus.CANCELLED,
      ],
      [EmergencyStatus.EN_ROUTE]: [
        EmergencyStatus.ON_SCENE,
        EmergencyStatus.CANCELLED,
      ],
      [EmergencyStatus.ON_SCENE]: [
        EmergencyStatus.TRANSPORTING,
        EmergencyStatus.COMPLETED,
        EmergencyStatus.CANCELLED,
      ],
      [EmergencyStatus.TRANSPORTING]: [EmergencyStatus.COMPLETED],
      [EmergencyStatus.COMPLETED]: [],
      [EmergencyStatus.CANCELLED]: [],
    };
    return flow[current] || [];
  };

  const availableStatuses = getNextStatuses(currentStatus);

  // Initialize with first available status (not currentStatus)
  const [status, setStatus] = useState<EmergencyStatus>(
    availableStatuses.length > 0 ? availableStatuses[0] : currentStatus
  );
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update status when currentStatus changes
  useEffect(() => {
    const nextStatuses = getNextStatuses(currentStatus);
    if (nextStatuses.length > 0) {
      setStatus(nextStatuses[0]);
    }
  }, [currentStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submitting if status is same as current
    if (status === currentStatus) {
      alert("กรุณาเลือกสถานะใหม่ที่แตกต่างจากสถานะปัจจุบัน");
      return;
    }

    setIsLoading(true);
    try {
      await onUpdate(status, notes || undefined);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    } finally {
      setIsLoading(false);
    }
  };

  if (availableStatuses.length === 0) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <div className="flex gap-3">
        <select
          value={status}
          onChange={(e) => {
            const newStatus = e.target.value as EmergencyStatus;
            console.log(
              "[UpdateStatusForm] Status changed:",
              currentStatus,
              "->",
              newStatus
            );
            setStatus(newStatus);
          }}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
        >
          {availableStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={notes}
          onChange={(e) => {
            const newNotes = e.target.value;
            console.log(
              "[UpdateStatusForm] Notes changed, length:",
              newNotes.length
            );
            setNotes(newNotes);
          }}
          placeholder="หมายเหตุ (ถ้ามี)"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? "กำลังอัปเดต..." : "อัปเดต"}
        </button>
      </div>
    </form>
  );
}
