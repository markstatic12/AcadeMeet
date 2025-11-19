import React from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import { getDaysInMonth, getMonthName, isCurrentMonth as checkIsCurrentMonth, getCurrentDay } from '../../utils/calendarUtils';

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

export default Calendar;
