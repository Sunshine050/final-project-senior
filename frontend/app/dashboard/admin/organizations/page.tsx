"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Role, Organization, OrganizationType } from "@/types";
import { api } from "@/lib/api";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function OrganizationsPage() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setIsLoading(true);
      const data = await api.getOrganizations();
      setOrganizations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load organizations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบองค์กรนี้?")) return;

    try {
      await api.deleteOrganization(id);
      loadOrganizations();
    } catch (error) {
      console.error("Failed to delete organization:", error);
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  };

  return (
    <ProtectedRoute allowedRoles={[Role.ADMIN]}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">จัดการองค์กร</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            สร้างองค์กรใหม่
          </button>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">กำลังโหลด...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ชื่อ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ประเภท
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ที่อยู่
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      เบอร์โทร
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ความจุ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {organizations.map((org) => (
                    <tr key={org.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {org.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {org.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{org.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {org.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {org.availableCapacity || 0} / {org.capacity || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingOrg(org)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(org.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showCreateModal && (
          <OrganizationFormModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              loadOrganizations();
            }}
          />
        )}

        {editingOrg && (
          <OrganizationFormModal
            organization={editingOrg}
            onClose={() => setEditingOrg(null)}
            onSuccess={() => {
              setEditingOrg(null);
              loadOrganizations();
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

// Organization Form Modal
function OrganizationFormModal({
  organization,
  onClose,
  onSuccess,
}: {
  organization?: Organization;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: organization?.name || "",
    type: organization?.type || OrganizationType.HOSPITAL,
    address: organization?.address || "",
    phone: organization?.phone || "",
    email: organization?.email || "",
    capacity: organization?.capacity || 0,
    availableCapacity: organization?.availableCapacity || 0,
    longitude: organization?.location?.coordinates[0] || 100.5018,
    latitude: organization?.location?.coordinates[1] || 13.7563,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        capacity: formData.capacity,
        availableCapacity: formData.availableCapacity,
        location: {
          type: "Point",
          coordinates: [formData.longitude, formData.latitude],
        },
        isActive: true,
      };

      if (organization) {
        await api.updateOrganization(organization.id, payload);
      } else {
        await api.createOrganization(payload);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save organization:", error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {organization ? "แก้ไของค์กร" : "สร้างองค์กรใหม่"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อองค์กร *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ประเภท *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as OrganizationType })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              <option value={OrganizationType.HOSPITAL}>โรงพยาบาล</option>
              <option value={OrganizationType.RESCUE_TEAM}>ทีมกู้ชีพ</option>
              <option value={OrganizationType.DISPATCH_CENTER}>ศูนย์สั่งการ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่ *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ความจุทั้งหมด</label>
              <input
                type="number"
                min="0"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ความจุว่าง</label>
              <input
                type="number"
                min="0"
                value={formData.availableCapacity}
                onChange={(e) => setFormData({ ...formData, availableCapacity: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ลองจิจูด</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ละติจูด</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

