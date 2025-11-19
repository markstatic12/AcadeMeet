import React from 'react';
import SessionTabs from './SessionTabs';
import Calendar from './Calendar';

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

export default CalendarSection;
