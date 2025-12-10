import api from "./apiClient";

export const notificationService = {

  async getAllNotifications() {
    const response = await api.get("/notifications/all");
    return response.data;
  },


  async getUnreadNotifications() {
    const response = await api.get("/notifications/unread");
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get("/notifications/unread/count");
    return response.data;
  },

  async markAsRead(notificationId) {
    const response = await api.patch(`/notifications/${notificationId}/read`, {});
    return response.data;
  },

  async markAsUnread(notificationId) {
    const response = await api.patch(`/notifications/${notificationId}/unread`, {});
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.post("/notifications/mark-all-read", {});
    return response.data;
  },
};
