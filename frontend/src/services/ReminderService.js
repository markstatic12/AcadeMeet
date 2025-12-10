/**
 * Reminder API Service - handles all reminder-related HTTP requests
 */
import api from './apiClient';

const API_BASE = '/reminders';

export const reminderService = {
  /**
   * Get active reminders for authenticated user
   * Sorted by: unread first, then by scheduled time descending
   */
  async getActiveReminders() {
    const response = await api.get(`${API_BASE}/active`);
    return response.data;
  },

  /**
   * Mark reminder as read (when user clicks on it)
   */
  async markAsRead(reminderId) {
    await api.patch(`${API_BASE}/${reminderId}/read`);
    return;
  },

  /**
   * Get unread reminder count (for badge)
   */
  async getUnreadCount() {
    const response = await api.get(`${API_BASE}/unread/count`);
    return response.data;
  }
};
