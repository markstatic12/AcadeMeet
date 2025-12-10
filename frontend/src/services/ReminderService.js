import api from './apiClient';

const API_BASE = '/reminders';

export const reminderService = {
  async getActiveReminders() {
    const response = await api.get(`${API_BASE}/active`);
    return response.data;
  },

  async markAsRead(reminderId) {
    await api.patch(`${API_BASE}/${reminderId}/read`);
    return;
  },

  async getUnreadCount() {
    const response = await api.get(`${API_BASE}/unread/count`);
    return response.data;
  }
};
