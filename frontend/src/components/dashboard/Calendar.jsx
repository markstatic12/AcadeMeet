import React from 'react';
import { getDaysInMonth, getMonthName, isCurrentMonth as checkIsCurrentMonth, getCurrentDay } from '../../utils/calendarUtils';
import SessionTabs from './SessionTabs';

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

const CalendarGrid = ({ daysInMonth, startingDayOfWeek, today, isCurrentMonth }) => {
  const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="grid grid-cols-7 gap-2">
      {/* Day Headers */}
      {dayHeaders.map((day) => (
        <div key={day} className="text-center text-gray-400 font-semibold text-sm py-2">
          {day}
        </div>
      ))}

      {/* Empty cells for days before month starts */}
      {Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }).map((_, index) => (
        <div key={`empty-${index}`} className="aspect-square"></div>
      ))}

      {/* Calendar Days */}
      {Array.from({ length: daysInMonth }).map((_, index) => {
        const day = index + 1;
        const isToday = isCurrentMonth && day === today;
        return (
          <div
            key={day}
            className={`aspect-square flex items-center justify-center rounded-xl text-white font-medium cursor-pointer transition-all ${
              isToday
                ? 'bg-indigo-600 hover:bg-indigo-500'
                : 'bg-gray-700/50 hover:bg-gray-700'
            }`}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
};

const Calendar = ({ currentMonth, onPrevious, onNext }) => {
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = getMonthName(currentMonth);
  const today = getCurrentDay();
  const isCurrentMonth = checkIsCurrentMonth(currentMonth);

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
      <CalendarHeader 
        monthName={monthName}
        onPrevious={onPrevious}
        onNext={onNext}
      />
      
      <CalendarGrid
        daysInMonth={daysInMonth}
        startingDayOfWeek={startingDayOfWeek}
        today={today}
        isCurrentMonth={isCurrentMonth}
      />
    </div>
  );
};

const CalendarSection = ({ 
  activeTab, 
  onTabChange, 
  currentMonth, 
  onPreviousMonth, 
  onNextMonth 
}) => {
  return (
    <div className="lg:col-span-2">
      <SessionTabs activeTab={activeTab} onTabChange={onTabChange} />
      <Calendar 
        currentMonth={currentMonth}
        onPrevious={onPreviousMonth}
        onNext={onNextMonth}
      />
    </div>
  );
};

export { Calendar, CalendarHeader, CalendarGrid, CalendarSection };
export default Calendar;