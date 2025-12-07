import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SuccessModal from '../ui/SuccessModal';
import { CalendarIcon, ClockIcon, LocationIcon, LockIcon } from '../../icons';
import { to12Hour } from '../../utils/timeUtils';
// SessionStatusBadge lives in the shared ui folder
import SessionStatusBadge from '../ui/SessionStatusBadge';
import { sessionService } from '../../services/SessionService';

// Session Card Component (General use - no menu)
const SessionCard = ({ session }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/session/${session.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f1e] border border-indigo-900/40 hover:border-indigo-500/60 rounded-xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-950/30 cursor-pointer group h-[260px] w-full"
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
      <div className="p-4 bg-[#0a0a0a]/50">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-white font-bold text-sm group-hover:text-indigo-400 transition-colors flex-1">
            {session.title}
          </h3>
          {/* Tags Display */}
          {session.tags && session.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end flex-shrink-0 max-w-[40%]">
              {session.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-indigo-600/20 border border-indigo-500/50 text-indigo-300 px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
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
      const data = await sessionService.getTrendingSessions();
      setSessions(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch trending sessions. Please try again later.');
      console.error("Error fetching trending sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <p className="text-white/60 text-sm">Loading...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && sessions.length === 0 && (
        <p className="text-white/60 text-sm">No trending sessions available.</p>
      )}
      {!loading && sessions.length > 0 && (
        <>
          {sessions.map((session) => (
            <div key={session.id} className="flex-shrink-0 h-full w-64 relative hover:z-10">
              <SessionCard session={session} />
            </div>
          ))}
        </>
      )}
    </>
  );
};

export { SessionCard, SessionsGrid, SessionsHeader, SessionsSection };

export default SessionsSection;