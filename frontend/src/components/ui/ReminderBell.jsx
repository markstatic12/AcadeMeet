import React, { useState, useEffect } from 'react';
import { getPendingReminderCount, getPendingReminders } from '../../services/ReminderService';
import { useUser } from '../../context/UserContext';

const ReminderBell = ({ className = '' }) => {
  const [reminderCount, setReminderCount] = useState(0);
  const [pendingReminders, setPendingReminders] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadReminderCount();
      // Poll for updates every 30 seconds
      const interval = setInterval(loadReminderCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadReminderCount = async () => {
    if (!user) return;

    try {
      const count = await getPendingReminderCount(user.id);
      setReminderCount(count);
    } catch (err) {
      console.error('Failed to load reminder count:', err);
    }
  };

  const loadPendingReminders = async () => {
    if (!user || loading) return;

    setLoading(true);
    try {
      const reminders = await getPendingReminders(user.id);
      setPendingReminders(reminders);
    } catch (err) {
      console.error('Failed to load pending reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBellClick = () => {
    if (!showDropdown) {
      loadPendingReminders();
    }
    setShowDropdown(!showDropdown);
  };

  const formatReminderTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMinutes = Math.floor((date - now) / (1000 * 60));
      
      if (diffMinutes <= 0) {
        return 'Now';
      } else if (diffMinutes < 60) {
        return `${diffMinutes}m`;
      } else if (diffMinutes < 1440) {
        return `${Math.floor(diffMinutes / 60)}h`;
      } else {
        return `${Math.floor(diffMinutes / 1440)}d`;
      }
    } catch {
      return 'Soon';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
        title="Reminders"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {reminderCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {reminderCount > 9 ? '9+' : reminderCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-medium">Upcoming Reminders</h3>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400">
                <div className="animate-spin w-5 h-5 border-2 border-gray-600 border-t-blue-500 rounded-full mx-auto"></div>
                <p className="mt-2 text-sm">Loading...</p>
              </div>
            ) : pendingReminders.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <p>No upcoming reminders</p>
              </div>
            ) : (
              <div className="py-2">
                {pendingReminders.slice(0, 5).map(reminder => (
                  <div key={reminder.id} className="px-4 py-3 hover:bg-gray-800 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">
                          {reminder.sessionTitle || 'Session Reminder'}
                        </p>
                        {reminder.reminderMessage && (
                          <p className="text-gray-400 text-xs mt-1">
                            {reminder.reminderMessage}
                          </p>
                        )}
                      </div>
                      <div className="ml-2 text-xs text-blue-400">
                        {formatReminderTime(reminder.reminderTime)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {pendingReminders.length > 5 && (
                  <div className="px-4 py-2 text-center border-t border-gray-700">
                    <button className="text-blue-400 text-sm hover:text-blue-300">
                      View all reminders
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default ReminderBell;