import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateSessionPage = () => {
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const [userData, setUserData] = useState({ name: 'Zander Aligato' });
  
  const [sessionData, setSessionData] = useState({
    title: '',
    host: '',
    month: '',
    day: '',
    year: '',
    startTime: '',
    endTime: '',
    location: '',
    tags: [],
    additionalNotes: '',
    description: ''
  });

  // Load user data from localStorage on mount
  useEffect(() => {
    const studentData = localStorage.getItem('student');
    if (studentData) {
      const student = JSON.parse(studentData);
      const userName = student.name || 'Zander Aligato';
      setUserData({ name: userName });
      setSessionData(prev => ({
        ...prev,
        host: userName
      }));
    } else {
      setSessionData(prev => ({
        ...prev,
        host: 'Zander Aligato'
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSessionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // NOTE: We keep the rich text editor UNCONTROLLED during typing to avoid caret jumping.
  // We only persist its HTML to React state on blur or explicit save to prevent reversal effect.
  const persistDescription = () => {
    if (textareaRef.current) {
      setSessionData(prev => ({
        ...prev,
        description: textareaRef.current.innerHTML
      }));
    }
  };

  // Rich text editor functions
  const applyFormatting = (command) => {
    document.execCommand(command, false, null);
  };

  const applyLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCreate = () => {
    // Ensure latest description is captured from the editor even if not blurred
    const latestDescription = textareaRef.current?.innerHTML || sessionData.description || '';

    // Helpers to format time to 12h with AM/PM
    const to12Hour = (t) => {
      if (!t || typeof t !== 'string' || !t.includes(':')) return '';
      const [hh, mm] = t.split(':');
      let h = parseInt(hh, 10);
      if (Number.isNaN(h)) return '';
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      if (h === 0) h = 12;
      return `${h}:${mm} ${ampm}`;
    };

    const formattedTime = (sessionData.startTime && sessionData.endTime)
      ? `${to12Hour(sessionData.startTime)} - ${to12Hour(sessionData.endTime)}`
      : (to12Hour(sessionData.startTime) || to12Hour(sessionData.endTime) || '');

    // Basic shape expected by Profile page cards
    const newSession = {
      id: Date.now(),
      title: sessionData.title || 'Untitled Session',
      tags: Array.isArray(sessionData.tags) ? sessionData.tags : [],
      date: [sessionData.month, sessionData.day, sessionData.year].filter(Boolean).join(' ')
        ? `${sessionData.month} ${sessionData.day}, ${sessionData.year}`
        : '',
      time: formattedTime,
      startTimeRaw: sessionData.startTime || '',
      endTimeRaw: sessionData.endTime || '',
      platform: sessionData.location || '',
      host: sessionData.host || '',
      description: latestDescription,
      createdAt: new Date().toISOString()
    };

    // Persist to localStorage (simple client-side store for now)
    try {
      const existing = JSON.parse(localStorage.getItem('sessions') || '[]');
      existing.unshift(newSession);
      localStorage.setItem('sessions', JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to persist session to localStorage:', e);
    }

    // Navigate to profile to view the new card
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-96 bg-gradient-to-bl from-indigo-900/30 via-purple-900/20 to-transparent"></div>
      
      {/* Custom CSS for contentEditable placeholder */}
      <style>{`
        [contentEditable=true]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          font-style: italic;
        }
      `}</style>
      
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={handleBack}
            className="flex items-center gap-3 text-white hover:text-indigo-400 transition-colors group"
          >
            <div className="w-10 h-10 bg-indigo-600/20 group-hover:bg-indigo-600/30 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-lg font-semibold">Back</span>
          </button>

          <button
            onClick={handleCreate}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/30"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create
          </button>
        </div>

        {/* Profile Picture and Title */}
        <div className="flex items-center gap-6 mb-12">
          <div className="relative">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <svg className="w-16 h-16 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 5h13v7h2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8v-2H4V5zm16 10l-4-4v3H9v2h7v3l4-4z"/>
              </svg>
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-colors shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div className="flex-1">
            <input
              type="text"
              name="title"
              value={sessionData.title}
              onChange={handleInputChange}
              placeholder="Enter Meeting Name"
              className="w-full bg-transparent text-4xl font-bold text-indigo-300 placeholder-indigo-300/50 focus:outline-none focus:text-white transition-colors"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Panel - Details */}
          <div className="bg-[#1a1a1a] rounded-2xl p-6">
            <h3 className="text-white font-bold text-xl mb-6">Details</h3>

            {/* Host */}
            <div className="mb-6">
              <div className="flex items-center gap-3 text-gray-400">
                <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span className="text-sm">{sessionData.host}</span>
              </div>
            </div>

            {/* Date */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex gap-2">
                <select
                  name="month"
                  value={sessionData.month}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-400 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="">Month</option>
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select
                  name="day"
                  value={sessionData.day}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-400 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="">Day</option>
                  {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <select
                  name="year"
                  value={sessionData.year}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-400 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="">Year</option>
                  {Array.from({length: 10}, (_, i) => 2025 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  name="startTime"
                  value={sessionData.startTime}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-400 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <span className="text-gray-500">—</span>
                <input
                  type="time"
                  name="endTime"
                  value={sessionData.endTime}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-400 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                name="location"
                value={sessionData.location}
                onChange={handleInputChange}
                placeholder="Enter location"
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors italic"
              />
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="text-white text-sm font-semibold mb-3 block">Tags:</label>
              <button className="w-10 h-10 bg-indigo-600/20 hover:bg-indigo-600/30 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="text-white text-sm font-semibold mb-3 block">Additional Notes:</label>
              <textarea
                name="additionalNotes"
                value={sessionData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Write here ..."
                rows="4"
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none italic"
              />
            </div>
          </div>

          {/* Right Panel - Meeting Overview */}
          <div className="col-span-2 bg-[#1a1a1a] rounded-2xl p-6">
            <h3 className="text-white font-bold text-xl mb-6">Meeting Overview</h3>

            {/* Rich Text Editor Toolbar */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
              <button 
                type="button"
                onClick={() => applyFormatting('bold')}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors font-bold"
                title="Bold"
              >
                B
              </button>
              <button 
                type="button"
                onClick={() => applyFormatting('italic')}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors italic font-serif"
                title="Italic"
              >
                I
              </button>
              <button 
                type="button"
                onClick={() => applyFormatting('underline')}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors underline font-serif"
                title="Underline"
              >
                U
              </button>
              <button 
                type="button"
                onClick={() => applyFormatting('insertUnorderedList')}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title="Bullet List"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button 
                type="button"
                onClick={applyLink}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title="Insert Link"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>
            </div>

            {/* Editable Content Area (uncontrolled while typing) */}
            <div
              ref={textareaRef}
              contentEditable
              suppressContentEditableWarning
              onBlur={persistDescription}
              className="w-full min-h-[400px] px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-gray-400 text-sm focus:outline-none focus:border-indigo-500 transition-colors overflow-y-auto"
              data-placeholder="Enter the full meeting agenda, detailed background, pre-read links, and required context here. Select text and use the toolbar above to format."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSessionPage;
