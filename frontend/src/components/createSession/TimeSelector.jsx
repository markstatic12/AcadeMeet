import React from 'react';

const TimeSelector = ({ startTime, endTime, onChange }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <input
          type="time"
          name="startTime"
          value={startTime}
          onChange={onChange}
          className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <span className="text-gray-500">—</span>
        <input
          type="time"
          name="endTime"
          value={endTime}
          onChange={onChange}
          className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>
    </div>
  );
};

export default TimeSelector;
