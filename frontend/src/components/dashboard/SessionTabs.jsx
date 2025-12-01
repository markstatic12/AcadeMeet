import React from 'react';

const SessionTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-3 mb-4">
      <button
        onClick={() => onTabChange('available')}
        className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
          activeTab === 'available'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        Available Sessions
      </button>
      <button
        onClick={() => onTabChange('my')}
        className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
          activeTab === 'my'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        Joined Sessions
      </button>
    </div>
  );
};

export default SessionTabs;
