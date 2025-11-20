import React from 'react';

const PageHeader = ({ onBack, onSave }) => {
  return (
    <div className="flex items-center justify-between mb-10">
      <button 
        onClick={onBack} 
        className="flex items-center gap-3 text-white hover:text-indigo-400 transition-colors group"
      >
        <div className="w-10 h-10 bg-indigo-600/20 group-hover:bg-indigo-600/30 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <span className="text-lg font-semibold">Back</span>
      </button>
      
      <div className="flex gap-3">
        <button 
          onClick={onSave} 
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/30"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Note
        </button>
      </div>
    </div>
  );
};

export default PageHeader;
