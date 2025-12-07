/**
 * Reminder API Service - handles all reminder-related HTTP requests
 */
import { authFetch } from './apiHelper';

const API_BASE = '/reminders';

// Helper function to handle API responses
const handleResponse = async (response, errorMessage = 'Request failed') => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || errorMessage);
  }
  return await response.json();
};

export const reminderService = {
  /**
   * Get active reminders for authenticated user
   * Sorted by: unread first, then by scheduled time descending
   */
  async getActiveReminders() {
    const response = await authFetch(`${API_BASE}/active`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch reminders');
  },

  /**
   * Mark reminder as read (when user clicks on it)
   */
  async markAsRead(reminderId) {
    const response = await authFetch(`${API_BASE}/${reminderId}/read`, {
      method: 'PATCH'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to mark reminder as read');
    }

    return;
  },

  /**
   * Get unread reminder count (for badge)
   */
  async getUnreadCount() {
    const response = await authFetch(`${API_BASE}/unread/count`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch unread count');
  }
};
