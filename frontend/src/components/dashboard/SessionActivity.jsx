import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDaysInMonth, getMonthName, isCurrentMonth as checkIsCurrentMonth, getCurrentDay } from '../../utils/calendarUtils';
import SessionTabs from './SessionTabs';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';
import { useCalendarSessions } from '../../services/useCalendarSessions';
import DaySessionsModal from './DaySessionsModal';
import { reminderService } from '../../services/ReminderService';

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

// Reminders Tab Component
const RemindersTab = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadReminders();
    // Poll every 60 seconds for new reminders
    const interval = setInterval(loadReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadReminders = async () => {
    try {
      const data = await reminderService.getActiveReminders();
      setReminders(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load reminders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReminderClick = async (reminder) => {
    try {
      // Mark as read
      await reminderService.markAsRead(reminder.id);
      
      // Update local state to show as read
      setReminders(reminders.map(r => 
        r.id === reminder.id 
          ? { ...r, read: true, readAt: new Date().toISOString() }
          : r
      ));

      // Navigate to session
      navigate(`/session/${reminder.sessionId}`);
    } catch (err) {
      console.error('Failed to mark reminder as read:', err);
    }
  };

  const formatScheduledTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 relative overflow-hidden animate-fadeSlideUp">
        <div className="relative z-10 h-full flex flex-col">
          <h3 className="text-xl font-bold text-white mb-4">Reminders</h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-400">Loading reminders...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 relative overflow-hidden animate-fadeSlideUp">
        <div className="relative z-10 h-full flex flex-col">
          <h3 className="text-xl font-bold text-white mb-4">Reminders</h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-red-400">Failed to load reminders</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden animate-fadeSlideUp">
      <div className="relative z-10 h-full flex flex-col">
        <h3 className="text-xl font-bold text-white mb-4">Reminders</h3>
        
        {reminders.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <span className="text-6xl mb-4">🔔</span>
            <p className="text-gray-400 text-lg">No active reminders</p>
            <p className="text-gray-500 text-sm mt-2">
              Reminders will appear here when you join sessions
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                onClick={() => handleReminderClick(reminder)}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  reminder.read
                    ? 'bg-gray-800/30 border-gray-700/30 opacity-50 hover:opacity-60'
                    : reminder.isOwner
                      ? 'bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20'
                      : 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    reminder.read
                      ? 'bg-gray-700/30'
                      : reminder.isOwner
                        ? 'bg-indigo-500/20'
                        : 'bg-purple-500/20'
                  }`}
                >
                  <span
                    className={`text-lg ${
                      reminder.read
                        ? 'text-gray-500'
                        : reminder.isOwner
                          ? 'text-indigo-300'
                          : 'text-purple-300'
                    }`}
                  >
                    ⏰
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm mb-1 ${reminder.read ? 'text-gray-400' : 'text-white'}`}>
                    {reminder.message}
                  </h4>
                  <p className="text-gray-500 text-xs">
                    {formatScheduledTime(reminder.scheduledTime)}
                  </p>
                  {reminder.read && (
                    <p className="text-gray-600 text-xs mt-1 italic">
                      Read {new Date(reminder.readAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
        <RemindersTab />
      )}
    </div>
  );
};

export { Calendar, CalendarHeader, CalendarGrid, CalendarSection };
export default Calendar;