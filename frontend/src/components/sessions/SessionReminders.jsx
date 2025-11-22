import React, { useState, useEffect } from 'react';
// Reminder service exports: createReminder, getUserReminders, deleteReminder
import { createReminder, getUserReminders, deleteReminder } from '../../services/ReminderService';
import { formatDistance, format } from 'date-fns';
import { useUser } from '../../context/UserContext';


export const ReminderCard = ({ reminder, onUpdate, onDelete }) => {
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) {
      return;
    }

    try {
      await deleteReminder(reminder.id);
      onDelete(reminder.id);
    } catch (err) {
      console.error('Failed to delete reminder:', err);
      alert('Failed to delete reminder. Please try again.');
    }
  };

  const formatReminderTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      
      if (date < now) {
        return {
          relative: `${formatDistance(date, now)} ago`,
          absolute: format(date, 'MMM d, yyyy h:mm a'),
          isPast: true
        };
      } else {
        return {
          relative: `in ${formatDistance(now, date)}`,
          absolute: format(date, 'MMM d, yyyy h:mm a'),
          isPast: false
        };
      }
    } catch {
      return {
        relative: 'Unknown time',
        absolute: 'Invalid date',
        isPast: false
      };
    }
  };

  const getNotificationTypeDisplay = (type) => {
    switch (type) {
      case 'EMAIL':
        return { text: 'Email', icon: '📧', color: 'text-blue-400' };
      case 'SMS':
        return { text: 'SMS', icon: '📱', color: 'text-green-400' };
      case 'IN_APP':
      default:
        return { text: 'In-App', icon: '🔔', color: 'text-yellow-400' };
    }
  };

  const timeInfo = formatReminderTime(reminder.reminderTime);
  const notificationInfo = getNotificationTypeDisplay(reminder.notificationType);

  return (
    <div className={`bg-gray-800 rounded-lg p-4 border-l-4 ${
      timeInfo.isPast 
        ? 'border-gray-500' 
        : reminder.isSent 
          ? 'border-green-500' 
          : 'border-blue-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Session Info */}
          {reminder.sessionTitle && (
            <div className="mb-2">
              <h4 className="text-white font-medium">{reminder.sessionTitle}</h4>
            </div>
          )}

          {/* Reminder Message */}
          {reminder.reminderMessage && (
            <div className="mb-3">
              <p className="text-gray-300 text-sm">{reminder.reminderMessage}</p>
            </div>
          )}

          {/* Time and Status */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Remind me:</span>
              <span className={timeInfo.isPast ? 'text-gray-500' : 'text-white'}>
                {timeInfo.relative}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <span className={notificationInfo.color}>
                {notificationInfo.icon}
              </span>
              <span className="text-gray-400">{notificationInfo.text}</span>
            </div>

            {reminder.isSent && (
              <div className="flex items-center space-x-1">
                <span className="text-green-400">✓</span>
                <span className="text-green-400 text-xs">Sent</span>
              </div>
            )}
          </div>

          {/* Absolute Time */}
          <div className="mt-1">
            <span className="text-gray-500 text-xs">{timeInfo.absolute}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
            title="Delete reminder"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ===== ADD REMINDER MODAL =====

export const AddReminderModal = ({ sessionId, userId, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    reminderTime: '',
    reminderMessage: '',
    notificationType: 'IN_APP'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.reminderTime) {
      setError('Please select a reminder time');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const reminderTime = new Date(formData.reminderTime).toISOString();
      const newReminder = await createReminder(
        userId,
        sessionId,
        reminderTime,
        formData.reminderMessage,
        formData.notificationType
      );
      onAdd(newReminder);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Get minimum datetime (now + 5 minutes)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Add Reminder</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reminder Time */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Remind me at
            </label>
            <input
              type="datetime-local"
              name="reminderTime"
              value={formData.reminderTime}
              onChange={handleChange}
              min={getMinDateTime()}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Notification Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notification Method
            </label>
            <select
              name="notificationType"
              value={formData.notificationType}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="IN_APP">In-App Notification</option>
              <option value="EMAIL">Email</option>
              <option value="SMS">SMS (if enabled)</option>
            </select>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Custom Message (Optional)
            </label>
            <textarea
              name="reminderMessage"
              value={formData.reminderMessage}
              onChange={handleChange}
              placeholder="Add a custom message for this reminder..."
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ===== REMINDER PANEL =====

export const ReminderPanel = ({ sessionId, className = '' }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadReminders();
    }
  }, [user]);

  const loadReminders = async () => {
    try {
      setLoading(true);
      setError(null);
      const remindersData = await getUserReminders(user.id);
      // Filter reminders for this session if sessionId is provided
      const filteredReminders = sessionId 
        ? remindersData.filter(reminder => reminder.sessionId === sessionId)
        : remindersData;
      setReminders(filteredReminders);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = (newReminder) => {
    setReminders(prev => [newReminder, ...prev]);
    setShowAddModal(false);
  };

  const handleDeleteReminder = async (reminderId) => {
    try {
      await deleteReminder(reminderId);
      setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
    } catch (err) {
      setError(err.message);
      console.error('Failed to delete reminder:', err);
    }
  };

  const handleUpdateReminder = (reminderId, updatedReminder) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === reminderId ? { ...reminder, ...updatedReminder } : reminder
    ));
  };

  if (!user) {
    return (
      <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
        <div className="text-center py-8 text-gray-400">
          <p>Please log in to view reminders.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4 w-1/3"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          {sessionId ? 'Session Reminders' : 'My Reminders'} ({reminders.length})
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Add Reminder
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {reminders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No reminders set yet.</p>
            <p className="text-sm mt-2">Set a reminder to get notified about upcoming sessions.</p>
          </div>
        ) : (
          reminders.map(reminder => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onUpdate={handleUpdateReminder}
              onDelete={handleDeleteReminder}
            />
          ))
        )}
      </div>

      {showAddModal && (
        <AddReminderModal
          sessionId={sessionId}
          userId={user.id}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddReminder}
        />
      )}
    </div>
  );
};



export default ReminderPanel;