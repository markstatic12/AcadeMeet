import React from 'react';

// Reminder Card Component
const ReminderCard = ({ reminder }) => {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors cursor-pointer">
      <div className={`${reminder.iconBg} w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
        {reminder.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium mb-1">{reminder.title}</p>
        <p className="text-gray-400 text-xs">
          {reminder.date} | {reminder.dateDetail}
        </p>
      </div>
    </div>
  );
};

// Reminders Section Component
const RemindersSection = ({ reminders }) => {
  return (
    <div className="flex-shrink-0">
      <h2 className="text-xl font-bold text-white mb-4">Up Next</h2>
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 space-y-3">
        {reminders.map((reminder) => (
          <ReminderCard key={reminder.id} reminder={reminder} />
        ))}
      </div>
    </div>
  );
};

export { ReminderCard, RemindersSection };
export default RemindersSection;
