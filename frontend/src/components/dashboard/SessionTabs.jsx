import React from 'react';

const SessionTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onTabChange("available")}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
          activeTab === "available"
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
            : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Available Sessions
      </button>
      <button
        onClick={() => onTabChange("my")}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
          activeTab === "my"
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
            : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Joined Sessions
      </button>
      <button
        onClick={() => onTabChange("reminders")}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
          activeTab === "reminders"
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
            : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        Reminders
      </button>
    </div>
  );
};

export default SessionTabs;
