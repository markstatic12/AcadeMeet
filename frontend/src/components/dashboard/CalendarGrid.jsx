import React from 'react';

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

export default CalendarGrid;
