// Reminder Service
import { useUser } from '../context/UserContext';
import { buildApiUrl, buildHeaders, handleApiResponse, API_CONFIG } from '../config/api';

/**
 * Hook-based reminder service for managing session reminders
 */
export const useReminderService = () => {
  const { getUserId } = useUser();

  const createReminder = async (sessionId, reminderTime, message = '', notificationType = 'IN_APP') => {
    const userId = getUserId();
    if (!userId) throw new Error('User not authenticated');
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.REMINDERS), {
      method: 'POST',
      headers: buildHeaders(userId),
      body: JSON.stringify({
        userId,
        sessionId,
        reminderTime,
        reminderMessage: message,
        notificationType
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create reminder');
    }

    return await response.json();
  };

  const getUserReminders = async () => {
    const userId = getUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.REMINDERS}?userId=${userId}`));
    
    if (!response.ok) {
      throw new Error('Failed to fetch reminders');
    }

    return await response.json();
  };

  const getPendingReminders = async () => {
    const userId = getUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.REMINDERS}/pending?userId=${userId}`));
    
    if (!response.ok) {
      throw new Error('Failed to fetch pending reminders');
    }

    return await response.json();
  };

  return {
    createReminder,
    getUserReminders,
    getPendingReminders
  };
};

// Legacy exports for backward compatibility - will be deprecated
export const createReminder = async (userId, sessionId, reminderTime, message = '', notificationType = 'IN_APP') => {
  const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.REMINDERS), {
    method: 'POST',
    headers: buildHeaders(userId),
    body: JSON.stringify({ userId, sessionId, reminderTime, reminderMessage: message, notificationType })
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create reminder');
  }
  return await response.json();
};

export const getUserReminders = async (userId) => {
  const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.REMINDERS}?userId=${userId}`));
  return await handleApiResponse(response, 'Failed to fetch reminders');
};

export const getPendingReminders = async (userId) => {
  const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.REMINDERS}/pending?userId=${userId}`));
  return await handleApiResponse(response, 'Failed to fetch pending reminders');
};

export const getPendingReminderCount = async (userId) => {
  const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.REMINDERS}/count?userId=${userId}`));
  return await handleApiResponse(response, 'Failed to fetch reminder count');
};

// Duplicate function removed - use the one above

export const updateReminder = async (reminderId, reminderTime, message = '', notificationType = 'IN_APP') => {
  const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.REMINDERS}/${reminderId}`), {
    method: 'PATCH',
    headers: buildHeaders(),
    body: JSON.stringify({
      reminderTime,
      reminderMessage: message,
      notificationType
    })
  });

  return await handleApiResponse(response, 'Failed to update reminder');
};

export const deleteReminder = async (reminderId) => {
  const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.REMINDERS}/${reminderId}`), {
    method: 'DELETE'
  });

  return await handleApiResponse(response, 'Failed to delete reminder');
};