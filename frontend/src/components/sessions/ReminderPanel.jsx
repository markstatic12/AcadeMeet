import React, { useState, useEffect } from 'react';
import { getUserReminders, deleteReminder } from '../../services/ReminderService';
import ReminderCard from './ReminderCard';
import AddReminderModal from './AddReminderModal';
import { useUser } from '../../context/UserContext';

const ReminderPanel = ({ sessionId, className = '' }) => {
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