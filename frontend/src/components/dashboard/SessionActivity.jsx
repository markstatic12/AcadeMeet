import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDaysInMonth, getMonthName, isCurrentMonth as checkIsCurrentMonth, getCurrentDay } from '../../utils/calendarUtils';
import SessionTabs from './SessionTabs';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';
import { useCalendarSessions } from '../../services/useCalendarSessions';
import DaySessionsModal from './DaySessionsModal';

const CalendarHeader = ({ monthName, year, onPrevious, onNext }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onPrevious}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <ChevronLeftIcon className="w-6 h-6 text-gray-400" />
      </button>
      <h3 className="text-2xl font-bold text-white">{monthName} {year}</h3>
      <button
        onClick={onNext}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <ChevronRightIcon className="w-6 h-6 text-gray-400" />
      </button>
    </div>
  );
};

const CalendarGrid = ({ daysInMonth, startingDayOfWeek, today, isCurrentMonth, hasSessionsOnDay, onDayClick }) => {
  const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="h-full grid grid-cols-7 gap-2"
      style={{
        gridTemplateRows: 'auto 1fr 1fr 1fr 1fr 1fr 1fr'
      }}
    >
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
        const hasSessions = hasSessionsOnDay(day);
        
        return (
          <div
            key={day}
            onClick={() => onDayClick(day)}
            className={`flex flex-col items-center justify-center rounded-xl text-white font-medium cursor-pointer transition-all relative group ${
              isToday
                ? 'bg-indigo-600 hover:bg-indigo-500 text-base'
                : hasSessions
                ? 'bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500/50 hover:border-green-400/70 text-sm shadow-lg shadow-green-500/20 hover:shadow-green-500/40'
                : 'bg-gray-700/50 hover:bg-gray-700 text-sm'
            }`}
            style={{ aspectRatio: '1' }}
          >
            <span>{day}</span>
          </div>
        );
      })}
    </div>
  );
};

const Calendar = ({ currentMonth, onPrevious, onNext }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const { hasSessionsOnDay } = useCalendarSessions(currentMonth);
  
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = getMonthName(currentMonth);
  const year = currentMonth.getFullYear();
  const today = getCurrentDay();
  const isCurrentMonth = checkIsCurrentMonth(currentMonth);

  const handleDayClick = (day) => {
    const year = currentMonth.getFullYear().toString();
    const month = currentMonth.toLocaleString('default', { month: 'long' });
    
    setSelectedDate({ year, month, day: day.toString() });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  return (
    <>
      <div className="h-full relative overflow-hidden">
        <div className="relative z-10 h-full flex flex-col">
          <CalendarHeader 
            monthName={monthName}
            year={year}
            onPrevious={onPrevious}
            onNext={onNext}
          />
          <div className="flex-1">
            <CalendarGrid
              daysInMonth={daysInMonth}
              startingDayOfWeek={startingDayOfWeek}
              today={today}
              isCurrentMonth={isCurrentMonth}
              hasSessionsOnDay={hasSessionsOnDay}
              onDayClick={handleDayClick}
            />
          </div>
        </div>
      </div>
      
      <DaySessionsModal
        isOpen={showModal}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
      />
    </>
  );
};

const CalendarSection = ({ 
  activeTab, 
  onTabChange, 
  currentMonth, 
  onPreviousMonth, 
  onNextMonth 
}) => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col">
      <SessionTabs activeTab={activeTab} onTabChange={onTabChange} />
      
      {/* Available Sessions Tab - Calendar */}
      {activeTab === 'available' && (
        <div className="flex-1 overflow-hidden animate-fadeSlideUp">
          <Calendar 
            currentMonth={currentMonth}
            onPrevious={onPreviousMonth}
            onNext={onNextMonth}
          />
        </div>
      )}

      {/* THIS MUST BE REPLACED WITH ACTUAL JOINED SESSIONS... */}
      {/* CURRENTLY HARD CODED TO NAVIGATE SESSION ID... */}
      {activeTab === 'my' && (
        <div className="flex-1 relative overflow-hidden animate-fadeSlideUp">
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">Joined Sessions</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
            <div 
              className="bg-gray-900/50 border border-gray-700/30 rounded-lg p-4 hover:border-indigo-500/50 transition-all cursor-pointer"
              onClick={() => navigate('/session/1')}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">JS</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm mb-1">JavaScript Bootcamp</h4>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <span>📅</span>
                    <span>Dec 10, 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                    <span>🕐</span>
                    <span>10:00 AM - 12:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="bg-gray-900/50 border border-gray-700/30 rounded-lg p-4 hover:border-indigo-500/50 transition-all cursor-pointer"
              onClick={() => navigate('/session/2')}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">DS</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm mb-1">Data Structures Study</h4>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <span>📅</span>
                    <span>Dec 12, 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                    <span>🕐</span>
                    <span>2:00 PM - 4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="bg-gray-900/50 border border-gray-700/30 rounded-lg p-4 hover:border-indigo-500/50 transition-all cursor-pointer"
              onClick={() => navigate('/session/3')}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">PY</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm mb-1">Python for Beginners</h4>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <span>📅</span>
                    <span>Dec 15, 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                    <span>🕐</span>
                    <span>3:00 PM - 5:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* REPLACE REMINDERS TAB WITH ACTUAL IMPLEMENTATION */}
      {activeTab === 'reminders' && (
        <div className="flex-1 relative overflow-hidden animate-fadeSlideUp">
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">Reminders</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
            <div className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-purple-300 text-lg">📚</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm mb-1">Complete Assignment 3</h4>
                <p className="text-gray-400 text-xs">Due: Dec 8, 2025 at 11:59 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-300 text-lg">📝</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm mb-1">Review Chapter 5</h4>
                <p className="text-gray-400 text-xs">Before next session</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-green-300 text-lg">✅</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm mb-1">Submit Project Proposal</h4>
                <p className="text-gray-400 text-xs">Due: Dec 15, 2025</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-orange-300 text-lg">⚡</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm mb-1">Prepare for Quiz</h4>
                <p className="text-gray-400 text-xs">Dec 9, 2025 - Chapter 1-3</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export { Calendar, CalendarHeader, CalendarGrid, CalendarSection };
export default Calendar;