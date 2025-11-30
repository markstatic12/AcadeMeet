import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SuccessModal from '../ui/SuccessModal';
import { CalendarIcon, ClockIcon, LocationIcon, LockIcon } from '../../icons';
import { to12Hour } from '../../utils/timeUtils';
// SessionStatusBadge lives in the shared ui folder
import SessionStatusBadge from '../ui/SessionStatusBadge';
import { authFetch } from '../../services/apiHelper';

// Session Card Component (General use - no menu)
const SessionCard = ({ session }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/session/${session.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 rounded-xl overflow-hidden transition-all hover:shadow-xl cursor-pointer group h-[260px] w-full"
    >
      {/* Session Thumbnail */}
      <div className="relative h-[120px] bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#3b82f6] overflow-hidden">
        {/* Status and Privacy Indicators */}
        <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
          <SessionStatusBadge status={session.status || 'ACTIVE'} />
          {session.sessionType === 'PRIVATE' && (
            <div className="flex items-center px-2 py-1 bg-black/30 rounded-full">
              <LockIcon className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-yellow-400 ml-1">Private</span>
            </div>
          )}
        </div>
        {/* Colorful shapes pattern - LEFT SIDE */}
        <div className="absolute left-0 top-0 w-1/2 h-full pointer-events-none">
          {/* Row 1 */}
          <div className="absolute top-2 left-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-white text-[8px] font-bold shadow-md">B</div>
          <div className="absolute top-2 left-10 w-5 h-5 bg-orange-500 rounded shadow-md"></div>
          <div className="absolute top-3 left-16 w-4 h-4 bg-cyan-400 rounded shadow-md"></div>
          
          {/* Row 2 */}
          <div className="absolute top-8 left-2 w-5 h-5 bg-blue-500 rounded shadow-md"></div>
          <div className="absolute top-7 left-9 w-6 h-6 bg-yellow-400 rounded transform rotate-12 shadow-md"></div>
          <div className="absolute top-8 left-16 w-5 h-5 bg-purple-500 rounded shadow-md"></div>
          
          {/* Row 3 */}
          <div className="absolute top-14 left-2 w-5 h-5 bg-pink-500 rounded-full shadow-md"></div>
          <div className="absolute top-13 left-9 w-5 h-5 bg-red-500 rounded shadow-md"></div>
          <div className="absolute top-14 left-15 w-4 h-4 bg-yellow-300 rounded-full shadow-md"></div>
        </div>
        
        {/* Pink diamond accent - CENTER TOP */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 pointer-events-none">
          <div className="w-7 h-7 bg-pink-500 rounded transform rotate-45 shadow-lg"></div>
        </div>
        
        {/* Phone illustration - RIGHT BOTTOM */}
        <div className="absolute bottom-0 right-0 w-1/2 h-full flex items-end justify-end p-2 pointer-events-none">
          <div className="relative">
            <div className="w-20 h-16 bg-[#1e40af] rounded-lg border-2 border-[#1e3a8a] shadow-xl"></div>
            <div className="absolute top-1 left-1 right-1 bottom-1 bg-[#2563eb] rounded"></div>
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-r-2 border-b-2 border-white/30 rounded-br-lg"></div>
          </div>
        </div>
      </div>

      {/* Session Info */}
      <div className="p-4 bg-[#0a0a0a]">
        <h3 className="text-white font-bold text-sm mb-2 group-hover:text-indigo-400 transition-colors">
          {session.title}
        </h3>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
            <CalendarIcon className="w-3 h-3 text-indigo-400" />
            <span>{session.month} {session.day}, {session.year}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
            <ClockIcon className="w-3 h-3 text-indigo-400" />
            <span>{to12Hour(session.startTime)} - {to12Hour(session.endTime)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
            <LocationIcon className="w-3 h-3 text-indigo-400" />
            <span>{session.location}</span>
          </div>
          {session.maxParticipants && (
            <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
              <span>👥</span>
              <span>{session.currentParticipants || 0}/{session.maxParticipants} participants</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sessions Grid Component
const SessionsGrid = ({ sessions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {sessions.map(session => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
};

// Sessions Header Component
const SessionsHeader = () => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-white">Sessions</h1>
    </div>
  );
};

// Sessions Section Component
const SessionsSection = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    // Show success modal if we navigated here after creating a session
    const state = location.state || {};
    if (state.sessionCreated) {
      setSuccessTitle(state.title || 'Session created');
      setShowSuccess(true);
      // clear navigation state to avoid showing again
      try { window.history.replaceState({}, document.title); } catch (_) {}
    }
  }, [location]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await authFetch('/sessions/all-sessions');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Only display first 4 sessions on dashboard
      setSessions(Array.isArray(data) ? data.slice(0, 4) : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sessions. Please try again later.');
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Active Sessions</h2>
      {loading && <p className="text-white/60">Loading sessions...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && sessions.length === 0 && (
        <p className="text-white/60">No sessions available.</p>
      )}
      {!loading && sessions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};

export { SessionCard, SessionsGrid, SessionsHeader, SessionsSection };

export default SessionsSection;