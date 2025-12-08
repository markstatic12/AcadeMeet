import { authFetch } from "./apiHelper";

const handleResponse = async (response, errorMessage = "Request failed") => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response:", response.status, errorText);
    throw new Error(`${errorMessage} (${response.status})`);
  }
  return await response.json();
};

export const notificationService = {
  /**
   * Get all notifications for current user
   */
  async getAllNotifications() {
    const response = await authFetch("/notifications/all", {
      method: "GET",
    });
    return handleResponse(response, "Failed to fetch notifications");
  },

  /**
   * Get unread notifications
   */
  async getUnreadNotifications() {
    const response = await authFetch("/notifications/unread", {
      method: "GET",
    });
    return handleResponse(response, "Failed to fetch unread notifications");
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount() {
    const response = await authFetch("/notifications/unread/count", {
      method: "GET",
    });
    return handleResponse(response, "Failed to fetch unread count");
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    const response = await authFetch(`/notifications/${notificationId}/read`, {
      method: "PATCH",
      body: JSON.stringify({}),
    });
    return handleResponse(response, "Failed to mark notification as read");
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    const response = await authFetch("/notifications/mark-all-read", {
      method: "POST",
      body: JSON.stringify({}),
    });
    return handleResponse(response, "Failed to mark all as read");
  },
};
