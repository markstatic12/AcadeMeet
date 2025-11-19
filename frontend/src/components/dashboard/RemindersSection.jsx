import React from 'react';
import ReminderCard from './ReminderCard';

const RemindersSection = ({ reminders }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Reminders</h2>
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 space-y-3">
        {reminders.map((reminder) => (
          <ReminderCard key={reminder.id} reminder={reminder} />
        ))}
      </div>
    </div>
  );
};

export default RemindersSection;
