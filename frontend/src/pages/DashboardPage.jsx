import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const DashboardPage = () => {
  const [activeSessionTab, setActiveSessionTab] = useState('available');
  const [activeNotesTab, setActiveNotesTab] = useState('my');
  const [currentMonth, setCurrentMonth] = useState(new Date());


  const popularSessions = [
    {
      id: 1,
      title: 'JAVA PROGRAMMING Examples',
      subtitle: 'Fundamentals of Java Programming',
      color: 'from-red-600 to-red-700',
      icon: '☕',
    },
    {
      id: 2,
      title: 'C# Programming',
      subtitle: 'Get to Know  C# Language',
      color: 'from-purple-600 to-purple-700',
      icon: 'C#',
    },
    {
      id: 3,
      title: 'spring boot',
      subtitle: 'Java Beans Basics',
      color: 'from-green-600 to-green-700',
      icon: '🍃',
    },
    {
      id: 4,
      title: 'Database Modeling',
      subtitle: 'Software Modeling Techniques',
      color: 'from-blue-500 to-blue-600',
      icon: '🗂️',
    },
  ];

  const reminders = [
    {
      id: 1,
      title: 'Java Programming Session will start at 3:00 PM',
      date: '12th PM',
      dateDetail: 'September 25, 2025',
      icon: '📅',
      iconBg: 'bg-blue-500',
    },
  ];

  const myNotes = [
    {
      id: 1,
      title: 'Introduction to Springboot',
      date: 'Created on September 11, 2025',
      icon: '📄',
      iconBg: 'bg-blue-500',
    },
  ];

  // Calendar logic
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const today = new Date().getDate();
  const currentMonthNum = new Date().getMonth();
  const isCurrentMonth = currentMonth.getMonth() === currentMonthNum;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Popular Sessions Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Popular Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularSessions.map((session) => (
              <div
                key={session.id}
                className={`bg-gradient-to-br ${session.color} rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform duration-300 shadow-xl`}
              >
                <div className="text-4xl mb-3">{session.icon}</div>
                <h3 className="text-white text-xl font-bold mb-2">{session.title}</h3>
                <p className="text-white/80 text-sm">{session.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            {/* Session Tabs */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setActiveSessionTab('available')}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                  activeSessionTab === 'available'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Available Sessions
              </button>
              <button
                onClick={() => setActiveSessionTab('my')}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                  activeSessionTab === 'my'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                My Sessions
              </button>
            </div>

            {/* Calendar */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-gray-400" />
                </button>
                <h3 className="text-2xl font-bold text-white">{monthName}</h3>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRightIcon className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
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
            </div>
          </div>

          {/* Right Sidebar - Reminders & Notes */}
          <div className="space-y-6">
            {/* Reminders */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Reminders</h2>
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 space-y-3">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <div className={`${reminder.iconBg} w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
                      {reminder.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium mb-1">{reminder.title}</p>
                      <p className="text-gray-400 text-xs">
                        {reminder.date} | {reminder.dateDetail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              {/* Notes Tabs */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setActiveNotesTab('my')}
                  className={`px-5 py-2 rounded-full font-semibold transition-all text-sm ${
                    activeNotesTab === 'my'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  My Notes
                </button>
                <button
                  onClick={() => setActiveNotesTab('saved')}
                  className={`px-5 py-2 rounded-full font-semibold transition-all text-sm ${
                    activeNotesTab === 'saved'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Saved Notes
                </button>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 space-y-3">
                {myNotes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <div className={`${note.iconBg} w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
                      {note.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium mb-1">{note.title}</p>
                      <p className="text-gray-400 text-xs">{note.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Icon Components
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

export default DashboardPage;
