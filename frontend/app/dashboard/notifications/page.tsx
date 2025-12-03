"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Notification } from "@/types";
import { api } from "@/lib/api";
import { Bell, Check, CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);

      if (!user) {
        setIsLoading(false);
        return;
      }

      const response = await api.getNotifications(50);

      // api.getNotifications() return = response.data (array)
      setNotifications(response || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead();

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <ProtectedRoute>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">การแจ้งเตือน</h1>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <CheckCheck className="h-4 w-4" />
              อ่านทั้งหมดแล้ว ({unreadCount})
            </button>
          )}
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            กำลังโหลด...
          </div>
        ) : notifications.length === 0 ? (
          /* No data */
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>ไม่มีการแจ้งเตือน</p>
          </div>
        ) : (
          /* Notifications list */
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
            {notifications.map((notification) => {
              const title = notification.title || "ไม่พบหัวข้อแจ้งเตือน";
              const message = notification.message || "";
              const createdAt = notification.createdAt
                ? new Date(notification.createdAt).toLocaleString("th-TH")
                : "-";

              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!notification.isRead && (
                          <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                        )}
                        <h3 className="font-semibold text-gray-900">{title}</h3>
                      </div>

                      <p className="text-gray-700 text-sm">{message}</p>
                      <p className="text-gray-500 text-xs mt-2">{createdAt}</p>
                    </div>

                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="ml-4 p-2 text-gray-400 hover:text-blue-600"
                        title="ทำเครื่องหมายว่าอ่านแล้ว"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
