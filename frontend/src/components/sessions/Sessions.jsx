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

  // Determine if session ends in AM or PM
  const endTime = session.endTime || '';
  // Handle both formats: already formatted (with AM/PM) or 24-hour format
  const isPM = endTime.toLowerCase().includes('pm') || 
               (!endTime.toLowerCase().includes('am') && 
                !endTime.toLowerCase().includes('pm') && 
                parseInt(endTime.split(':')[0]) >= 12);

  return (
    <div 
      onClick={handleClick}
      className="bg-[#161A2B] border border-gray-700/50 hover:border-indigo-500/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20 cursor-pointer group w-full relative"
    >
      {/* Elegant Header with Sophisticated Gradient */}
      <div className="relative p-3 bg-gradient-to-br from-gray-800/50 via-gray-850/40 to-gray-900/50 border-b border-gray-700/40 overflow-hidden">
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-600/8 to-gray-600/8 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-gradient-to-tr from-gray-700/8 to-violet-700/8 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        
        {/* Minimal decorative accents */}
        <div className="absolute top-3 right-6 w-1.5 h-1.5 bg-violet-400/15 rounded-full"></div>
        <div className="absolute bottom-3 left-6 w-1 h-1 bg-gray-400/15 rounded-full"></div>
        
        {/* Subtle shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1500"></div>
        
        {/* Status and Privacy Indicators */}
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-2">
            <SessionStatusBadge status={session.status} />
            {session.sessionType === 'PRIVATE' && (
              <div className="flex items-center px-2 py-0.5 bg-amber-900/20 backdrop-blur-sm rounded border border-amber-700/30 shadow-sm">
                <LockIcon className="w-3 h-3 text-amber-500/90" />
                <span className="text-xs text-amber-400/90 ml-1 font-medium">Private</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Title with subtle hover effect */}
        <h3 className="text-white font-semibold text-base group-hover:text-gray-100 transition-colors truncate relative z-10">
          {session.title}
        </h3>
      </div>

      {/* Session Info */}
      <div className="p-3 bg-gradient-to-br from-[#161A2B] to-[#1a1f35]/95 transition-all relative">
        <div className="space-y-2">
          {/* Date with sophisticated rose/coral */}
          <div className="flex items-center gap-2 text-gray-300 text-xs group-hover:text-rose-200 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-600/18 to-rose-700/12 flex items-center justify-center group-hover:from-rose-600/22 group-hover:to-rose-700/16 transition-colors shrink-0 border border-rose-600/15">
              <CalendarIcon className="w-3.5 h-3.5 text-rose-400/90 group-hover:scale-105 transition-transform" />
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
                  <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-amber-700/30 flex items-center gap-1.5 shadow-lg">
                    <LockIcon className="w-3.5 h-3.5 text-amber-500/90" />
                    <span className="text-xs text-amber-400/90 font-medium">Private Details</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Time with elegant violet and subtle sun/moon indicator */}
              <div className="flex items-center gap-2 text-gray-300 text-xs group-hover:text-violet-200 transition-colors">
                <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600/18 to-violet-700/12 flex items-center justify-center group-hover:from-violet-600/22 group-hover:to-violet-700/16 transition-colors shrink-0 border border-violet-600/15">
                  <ClockIcon className="w-3.5 h-3.5 text-violet-400/90 group-hover:scale-105 transition-transform" />
                  {/* Subtle Sun/Moon indicator */}
                  {isPM ? (
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-500/80 to-indigo-600/70 flex items-center justify-center border border-indigo-400/30">
                      <div className="text-[6px] opacity-80">🌙</div>
                    </div>
                  ) : (
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-400/80 to-amber-500/70 flex items-center justify-center border border-amber-300/30">
                      <div className="text-[6px] opacity-80">☀️</div>
                    </div>
                  )}
                </div>
                <span className="font-medium">{to12Hour(session.startTime)} - {to12Hour(session.endTime)}</span>
              </div>
              {/* Location with sophisticated emerald */}
              <div className="flex items-center gap-2 text-gray-300 text-xs group-hover:text-emerald-200 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600/18 to-emerald-700/12 flex items-center justify-center group-hover:from-emerald-600/22 group-hover:to-emerald-700/16 transition-colors shrink-0 border border-emerald-600/15">
                  <LocationIcon className="w-3.5 h-3.5 text-emerald-400/90 group-hover:scale-105 transition-transform" />
                </div>
                <span className="font-medium truncate">{session.location}</span>
              </div>
              {/* Participants with refined sky blue */}
              {session.maxParticipants && (
                <div className="flex items-center gap-2 text-gray-300 text-xs group-hover:text-sky-200 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-600/18 to-sky-700/12 flex items-center justify-center group-hover:from-sky-600/22 group-hover:to-sky-700/16 transition-colors shrink-0 border border-sky-600/15">
                    <span className="text-base">👥</span>
                  </div>
                  <span className="font-medium">{session.currentParticipants || 0}/{session.maxParticipants} participants</span>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Refined bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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