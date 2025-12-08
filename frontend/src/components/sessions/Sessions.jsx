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
      className="bg-[#161A2B] border border-gray-700/50 hover:border-indigo-500/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20 cursor-pointer group w-full relative"
    >
      {/* Compact Header with Status */}
      <div className="relative p-3 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border-b border-indigo-500/20">
        {/* Status and Privacy Indicators */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <SessionStatusBadge status={session.status} />
            {session.sessionType === 'PRIVATE' && (
              <div className="flex items-center px-2 py-0.5 bg-yellow-500/10 backdrop-blur-sm rounded border border-yellow-500/30">
                <LockIcon className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-yellow-400 ml-1 font-semibold">Private</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-white font-bold text-base group-hover:text-indigo-300 transition-colors truncate">
          {session.title}
        </h3>
      </div>

      {/* Session Info */}
      <div className="p-3 bg-[#161A2B] transition-all relative">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-300 text-xs group-hover:text-white transition-colors">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 flex items-center justify-center group-hover:bg-indigo-600/30 transition-colors shrink-0">
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-medium">{session.month} {session.day}, {session.year}</span>
          </div>
          {session.sessionType === 'PRIVATE' ? (
            <>
              {/* Blurred/Locked details for private sessions */}
              <div className="relative">
                <div className="space-y-2 blur-[2px] select-none pointer-events-none opacity-40">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <div className="w-7 h-7 rounded-lg bg-gray-600/10 flex items-center justify-center">
                      <ClockIcon className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <span>••:•• •• - ••:•• ••</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <div className="w-7 h-7 rounded-lg bg-gray-600/10 flex items-center justify-center">
                      <LocationIcon className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <span>••••••••••</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <div className="w-7 h-7 rounded-lg bg-gray-600/10 flex items-center justify-center">
                      <span className="text-sm">👥</span>
                    </div>
                    <span>•/•• participants</span>
                  </div>
                </div>
                {/* Lock overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-yellow-500/30 flex items-center gap-1.5">
                    <LockIcon className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-xs text-yellow-400 font-semibold">Private Details</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-gray-300 text-xs group-hover:text-white transition-colors">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 flex items-center justify-center group-hover:bg-indigo-600/30 transition-colors shrink-0">
                  <ClockIcon className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
                <span className="font-medium">{to12Hour(session.startTime)} - {to12Hour(session.endTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-xs group-hover:text-white transition-colors">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 flex items-center justify-center group-hover:bg-indigo-600/30 transition-colors shrink-0">
                  <LocationIcon className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
                <span className="font-medium truncate">{session.location}</span>
              </div>
              {session.maxParticipants && (
                <div className="flex items-center gap-2 text-gray-300 text-xs group-hover:text-white transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-green-600/20 flex items-center justify-center group-hover:bg-green-600/30 transition-colors shrink-0">
                    <span className="text-base">👥</span>
                  </div>
                  <span className="font-medium">{session.currentParticipants || 0}/{session.maxParticipants} participants</span>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const q = (query || '').trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}&tab=session`);
  };

  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h1 className="text-3xl font-bold text-white">Sessions</h1>

      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search sessions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            className="w-64 px-3 py-2 bg-[#0f1724] border border-gray-800/50 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          <button
            onClick={handleSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 text-gray-300 hover:text-white"
            aria-label="Search sessions"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 18A7.5 7.5 0 1010.5 3a7.5 7.5 0 000 15z" />
            </svg>
          </button>
        </div>
      </div>
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
      
      // Filter out COMPLETED sessions from dashboard
      const activeSessions = (Array.isArray(data) ? data : []).filter(
        s => s.status !== 'COMPLETED'
      );
      
      setSessions(activeSessions);
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