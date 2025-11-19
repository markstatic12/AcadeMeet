import React from 'react';

const DescriptionPanel = ({ value, onChange }) => {
  return (
    <div className="col-span-2 bg-[#1a1a1a] rounded-2xl p-6">
      <h3 className="text-white font-bold text-xl mb-6">Meeting Overview</h3>

      <textarea
        name="description"
        value={value}
        onChange={onChange}
        placeholder="Describe the meeting..."
        rows={18}
        className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-gray-300 text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors"
      />
    </div>
  );
};

export default DescriptionPanel;
