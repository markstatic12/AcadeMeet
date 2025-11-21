import React, { useState } from 'react';
import { createReminder } from '../../services/ReminderService';

const AddReminderModal = ({ sessionId, userId, onClose, onAdd }) => {
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

export default AddReminderModal;