// Reminder Service
import { useUser } from '../context/UserContext';
import { authFetch } from './apiHelper';

// Hook-based reminder service
export const useReminderService = () => {
  const { getUserId } = useUser();

  const createReminder = async (sessionId, reminderTime, message = '', notificationType = 'IN_APP') => {
    const userId = getUserId();
    if (!userId) throw new Error('User not authenticated');
    const response = await authFetch('/reminders', {
      method: 'POST',
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
    
    const response = await authFetch(`/reminders?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch reminders');
    }

    return await response.json();
  };

  const getPendingReminders = async () => {
    const userId = getUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const response = await authFetch(`/reminders/pending?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch pending reminders');
    }

    const data = await response.json();
    return data.count;
  };

  return {
    createReminder,
    getUserReminders,
    getPendingReminders,
    getPendingReminderCount
  };
};

// Legacy exports for backward compatibility - will be deprecated
export const createReminder = async (userId, sessionId, reminderTime, message = '', notificationType = 'IN_APP') => {
  const response = await fetch('http://localhost:8080/api/reminders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, sessionId, reminderTime, reminderMessage: message, notificationType })
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create reminder');
  }
  return await response.json();
};

export const getUserReminders = async (userId) => {
  const response = await fetch(`http://localhost:8080/api/reminders?userId=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch reminders');
  return await response.json();
};

export const getPendingReminders = async (userId) => {
  const response = await fetch(`http://localhost:8080/api/reminders/pending?userId=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch pending reminders');
  return await response.json();
};


export const getPendingReminderCount = async (userId) => {
  const response = await fetch(`http://localhost:8080/api/reminders/count?userId=${userId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch reminder count');
  }

  const data = await response.json();
  return data.count;
};

export const updateReminder = async (reminderId, reminderTime, message = '', notificationType = 'IN_APP') => {
  const response = await fetch(`http://localhost:8080/api/reminders/${reminderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reminderTime,
      reminderMessage: message,
      notificationType
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update reminder');
  }

  return await response.json();
};

export const deleteReminder = async (reminderId) => {
  const response = await fetch(`http://localhost:8080/api/reminders/${reminderId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete reminder');
  }

  return await response.json();
};