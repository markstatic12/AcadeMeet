import React from 'react';

const NotesTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-3 mb-4">
      <button
        onClick={() => onTabChange('my')}
        className={`px-5 py-2 rounded-full font-semibold transition-all text-sm ${
          activeTab === 'my'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        My Notes
      </button>
      <button
        onClick={() => onTabChange('saved')}
        className={`px-5 py-2 rounded-full font-semibold transition-all text-sm ${
          activeTab === 'saved'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        Saved Notes
      </button>
    </div>
  );
};

export default NotesTabs;
