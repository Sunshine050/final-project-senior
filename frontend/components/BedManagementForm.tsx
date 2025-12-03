"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Organization } from "@/types";

interface BedManagementFormProps {
  hospitalId: string;
  onUpdate?: () => void;
}

export function BedManagementForm({ hospitalId, onUpdate }: BedManagementFormProps) {
  const [hospital, setHospital] = useState<Organization | null>(null);
  const [availableBeds, setAvailableBeds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadHospital();
  }, [hospitalId]);

  const loadHospital = async () => {
    try {
      setIsLoading(true);
      const data = await api.getHospital(hospitalId);
      setHospital(data);
      setAvailableBeds(data.availableCapacity || 0);
    } catch (error) {
      console.error("Failed to load hospital:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateHospitalBeds(hospitalId, availableBeds);
      if (onUpdate) onUpdate();
      alert("อัปเดตจำนวนเตียงเรียบร้อยแล้ว");
    } catch (error) {
      console.error("Failed to update beds:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดต");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">กำลังโหลด...</div>;
  }

  if (!hospital) {
    return <div className="p-4 text-center text-gray-500">ไม่พบข้อมูลโรงพยาบาล</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">จัดการเตียง - {hospital.name}</h2>
      
      <div className="mb-6 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">ความจุทั้งหมด:</span>
          <span className="font-medium">{hospital.capacity || 0} เตียง</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">เตียงว่างปัจจุบัน:</span>
          <span className="font-medium text-blue-600">
            {hospital.availableCapacity || 0} เตียง
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">เตียงที่ใช้:</span>
          <span className="font-medium text-red-600">
            {(hospital.capacity || 0) - (hospital.availableCapacity || 0)} เตียง
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            จำนวนเตียงว่าง
          </label>
          <input
            type="number"
            min="0"
            max={hospital.capacity || 0}
            value={availableBeds}
            onChange={(e) => setAvailableBeds(parseInt(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            ต้องไม่เกิน {hospital.capacity || 0} เตียง
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? "กำลังบันทึก..." : "อัปเดตจำนวนเตียง"}
        </button>
      </form>
    </div>
  );
}

