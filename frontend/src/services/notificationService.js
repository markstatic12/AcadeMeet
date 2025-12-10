import api from "./apiClient";

export const notificationService = {
  /**
   * Get all notifications for current user
   */
  async getAllNotifications() {
    const response = await api.get("/notifications/all");
    return response.data;
  },

  /**
   * Get unread notifications
   */
  async getUnreadNotifications() {
    const response = await api.get("/notifications/unread");
    return response.data;
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount() {
    const response = await api.get("/notifications/unread/count");
    return response.data;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    const response = await api.patch(`/notifications/${notificationId}/read`, {});
    return response.data;
  },

  /**
   * Mark notification as unread
   */
  async markAsUnread(notificationId) {
    const response = await api.patch(`/notifications/${notificationId}/unread`, {});
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    const response = await api.post("/notifications/mark-all-read", {});
    return response.data;
  },
};
