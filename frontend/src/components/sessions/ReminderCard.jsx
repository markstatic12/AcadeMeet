import React from 'react';
import { deleteReminder } from '../../services/ReminderService';
import { formatDistance, format } from 'date-fns';

const ReminderCard = ({ reminder, onUpdate, onDelete }) => {
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

export default ReminderCard;