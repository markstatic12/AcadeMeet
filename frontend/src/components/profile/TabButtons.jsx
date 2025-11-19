import React from 'react';

const TabButtons = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTabChange('sessions');
        }}
        className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all ${
          activeTab === 'sessions'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
      >
        Sessions
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTabChange('notes');
        }}
        className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all ${
          activeTab === 'notes'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
      >
        Notes
      </button>
    </div>
  );
};

export default TabButtons;
