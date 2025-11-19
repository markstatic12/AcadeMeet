import React from 'react';

const ChevronLeftIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const CalendarHeader = ({ monthName, onPrevious, onNext }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onPrevious}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <ChevronLeftIcon className="w-6 h-6 text-gray-400" />
      </button>
      <h3 className="text-2xl font-bold text-white">{monthName}</h3>
      <button
        onClick={onNext}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <ChevronRightIcon className="w-6 h-6 text-gray-400" />
      </button>
    </div>
  );
};

export default CalendarHeader;
