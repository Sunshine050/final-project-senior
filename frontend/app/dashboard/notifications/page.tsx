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
    console.log("[NotificationsPage] Component mounted, loading notifications");
    loadNotifications();
  }, []);

  useEffect(() => {
    console.log(
      "[NotificationsPage] User changed:",
      user ? { id: user.id, email: user.email } : "null"
    );
  }, [user]);

  useEffect(() => {
    const safeNotifications = Array.isArray(notifications) ? notifications : [];
    console.log(
      "[NotificationsPage] Notifications state changed, count:",
      safeNotifications.length,
      "type:",
      Array.isArray(notifications) ? "array" : typeof notifications
    );
  }, [notifications]);

  const loadNotifications = async () => {
    try {
      console.log(
        "[NotificationsPage] loadNotifications: Starting to load notifications"
      );
      setIsLoading(true);

      if (!user) {
        console.log(
          "[NotificationsPage] loadNotifications: No user found, skipping load"
        );
        setIsLoading(false);
        return;
      }

      console.log(
        "[NotificationsPage] loadNotifications: Fetching notifications for user:",
        user.id
      );
      const response = await api.getNotifications(50);
      console.log(
        "[NotificationsPage] loadNotifications: Received response:",
        response,
        "type:",
        typeof response,
        "isArray:",
        Array.isArray(response)
      );

      // Handle different response formats
      let notificationsData: Notification[] = [];
      if (Array.isArray(response)) {
        notificationsData = response;
      } else if (
        response &&
        typeof response === "object" &&
        "data" in response
      ) {
        // If response has a data property
        notificationsData = Array.isArray(response.data) ? response.data : [];
      } else if (
        response &&
        typeof response === "object" &&
        "notifications" in response
      ) {
        // If response has a notifications property
        notificationsData = Array.isArray(response.notifications)
          ? response.notifications
          : [];
      }

      console.log(
        "[NotificationsPage] loadNotifications: Setting notifications, count:",
        notificationsData.length
      );
      setNotifications(notificationsData);
    } catch (error) {
      console.error(
        "[NotificationsPage] loadNotifications: Failed to load notifications:",
        error
      );
    } finally {
      console.log("[NotificationsPage] loadNotifications: Loading completed");
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      console.log(
        "[NotificationsPage] handleMarkAsRead: Marking notification as read, id:",
        id
      );
      await api.markNotificationRead(id);
      console.log(
        "[NotificationsPage] handleMarkAsRead: Successfully marked notification as read, id:",
        id
      );

      setNotifications((prev) => {
        const updated = prev.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        );
        console.log(
          "[NotificationsPage] handleMarkAsRead: Updated notifications state"
        );
        return updated;
      });
    } catch (error) {
      console.error(
        "[NotificationsPage] handleMarkAsRead: Failed to mark notification as read, id:",
        id,
        "error:",
        error
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const safeNotifications = Array.isArray(notifications)
        ? notifications
        : [];
      const unreadCountBefore = safeNotifications.filter(
        (n) => !n.isRead
      ).length;
      console.log(
        "[NotificationsPage] handleMarkAllAsRead: Marking all notifications as read, unread count:",
        unreadCountBefore
      );

      await api.markAllNotificationsRead();
      console.log(
        "[NotificationsPage] handleMarkAllAsRead: Successfully marked all notifications as read"
      );

      setNotifications((prev) => {
        const updated = prev.map((n) => ({ ...n, isRead: true }));
        console.log(
          "[NotificationsPage] handleMarkAllAsRead: Updated all notifications state, count:",
          updated.length
        );
        return updated;
      });
    } catch (error) {
      console.error(
        "[NotificationsPage] handleMarkAllAsRead: Failed to mark all as read, error:",
        error
      );
    }
  };

  // Safety check: ensure notifications is always an array
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter((n) => !n.isRead).length;
  console.log(
    "[NotificationsPage] Render: isLoading:",
    isLoading,
    "notifications count:",
    safeNotifications.length,
    "unread count:",
    unreadCount,
    "notifications type:",
    Array.isArray(notifications) ? "array" : typeof notifications
  );

  return (
    <ProtectedRoute>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">การแจ้งเตือน</h1>

          {unreadCount > 0 && (
            <button
              onClick={() => {
                console.log(
                  "[NotificationsPage] Mark all as read button clicked"
                );
                handleMarkAllAsRead();
              }}
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
        ) : safeNotifications.length === 0 ? (
          /* No data */
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>ไม่มีการแจ้งเตือน</p>
          </div>
        ) : (
          /* Notifications list */
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
            {safeNotifications.map((notification) => {
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
                        onClick={() => {
                          console.log(
                            "[NotificationsPage] Mark as read button clicked for notification:",
                            notification.id,
                            "title:",
                            title
                          );
                          handleMarkAsRead(notification.id);
                        }}
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
