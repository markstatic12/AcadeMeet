import React from 'react';

const SessionProfilePic = () => {
  return (
    <div className="relative">
      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden">
        <svg className="w-16 h-16 text-indigo-400" fill="currentColor">
          <path d="M4 5h13v7h2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8v-2H4V5zm16 10l-4-4v3H9v2h7v3l4-4z" />
        </svg>
      </div>
      <button 
        type="button"
        className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-colors shadow-lg"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
        </svg>
      </button>
    </div>
  );
};

export default SessionProfilePic;
