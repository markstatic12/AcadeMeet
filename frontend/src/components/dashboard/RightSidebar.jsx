import React from 'react';
import RemindersSection from './Reminders';

const RightSidebar = ({ reminders }) => {
  return (
    <div className="h-full bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden">
      <div className="h-full overflow-y-auto custom-scrollbar p-5">
        <RemindersSection reminders={reminders} />
      </div>
    </div>
  );
};

export default RightSidebar;
