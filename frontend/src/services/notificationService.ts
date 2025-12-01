import api from '@/lib/api';
import { NotificationListResponse, Notification } from '@/types/emergency';

export const notificationService = {
  /**
   * Get user notifications
   */
  async getNotifications(limit?: number): Promise<NotificationListResponse> {
    const response = await api.get<NotificationListResponse>('/notifications', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<Notification> {
    const response = await api.patch<Notification>(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ markedCount: number }> {
    const response = await api.post<{ markedCount: number }>('/notifications/mark-all-read');
    return response.data;
  },
};

export default notificationService;

