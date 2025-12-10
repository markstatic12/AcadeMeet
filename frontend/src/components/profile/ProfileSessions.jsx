import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeDotsVerticalIcon, TrashIcon, CalendarIcon, ClockIcon, LocationIcon, LockIcon } from '../../icons';
import { to12Hour } from '../../utils/timeUtils';
import SessionStatusBadge from '../ui/SessionStatusBadge';
import { CreateNewCard } from './ProfileNavigation';

// ===== SESSION CARD =====

export const SessionCard = ({ session, openMenuId, onMenuToggle, onDelete }) => {
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
            {session.sessionPrivacy === 'PRIVATE' && (
              <div className="flex items-center px-2 py-0.5 bg-amber-900/20 backdrop-blur-sm rounded border border-amber-700/30 shadow-sm">
                <LockIcon className="w-3 h-3 text-amber-500/90" />
                <span className="text-xs text-amber-400/90 ml-1 font-medium">Private</span>
              </div>
            )}
          </div>
          
          {/* Three dots button */}
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              onMenuToggle(session.id); 
            }}
            className="p-1.5 bg-gray-800/50 hover:bg-gray-700/70 rounded-lg text-gray-400 hover:text-gray-200 transition-all hover:scale-105 backdrop-blur-md border border-gray-700/30 hover:border-gray-600/40 relative z-10"
            title="Options"
          >
            <ThreeDotsVerticalIcon className="w-3.5 h-3.5" />
          </button>
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
          {session.sessionPrivacy === 'PRIVATE' ? (
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
              <div className="flex items-center gap-2 text-gray-300 text-xs group-hover:text-sky-200 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-600/18 to-sky-700/12 flex items-center justify-center group-hover:from-sky-600/22 group-hover:to-sky-700/16 transition-colors shrink-0 border border-sky-600/15">
                  <span className="text-base">👥</span>
                </div>
                <span className="font-medium">{session.currentParticipants || 0}/{session.maxParticipants || '∞'} participants</span>
              </div>
            </>
          )}
        </div>
        
        {/* Refined bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      
      {/* Dropdown menu - positioned relative to card wrapper, outside overflow */}
      {openMenuId === session.id && (
        <div className="absolute top-16 right-4 w-40 bg-[#1a1f35]/95 border border-red-500/30 rounded-lg shadow-2xl shadow-black/50 z-[100] overflow-hidden animate-slideDown backdrop-blur-xl card-options-menu">
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              onDelete(session.id); 
            }}
            className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-600/20 flex items-center gap-2.5 transition-all group/delete font-semibold"
          >
            <TrashIcon className="w-4 h-4 group-hover/delete:scale-110 transition-transform" />
            <span>Trash</span>
          </button>   
        </div>
      )}
    </div>
  );
};


// ===== TRASHED SESSION CARD =====

export const TrashedSessionCard = ({ session, onRestore }) => {
  return (
    <div className="relative bg-[#161A2B] border border-gray-700/50 rounded-2xl overflow-hidden transition-all hover:border-gray-700 hover:shadow-lg group h-[180px] w-full">
      {/* Vertical Restore action */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
        <button
          onClick={() => onRestore(session.id)}
          className="px-3 py-2 text-xs rounded-lg bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-300 border border-green-500/40 hover:border-green-500/60 hover:from-green-600/30 hover:to-emerald-600/30 transition-all hover:scale-110 font-bold shadow-lg hover:shadow-green-500/30 backdrop-blur-sm"
        >
          ↻ Restore
        </button>
      </div>
      
      <div className="relative h-[105px] bg-[#161A2B] overflow-hidden">
        {/* Diagonal stripes pattern for deleted items */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)'
        }}></div>
        
        <span className="absolute top-2 left-2 text-[10px] px-2.5 py-1 bg-red-500/20 text-red-300 rounded-full border border-red-500/40 font-bold shadow-lg backdrop-blur-sm">
          <span className="inline-block w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5 animate-pulse"></span>
          Trashed
        </span>
        
        {/* Faded session icon */}
        <div className="absolute bottom-2 right-2 opacity-20">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>
      
      <div className="p-4 bg-[#161A2B] relative">
        {/* Top gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent"></div>
        
        <h3 className="text-white/60 font-bold text-sm mb-3 line-through flex items-center gap-2">
          <span className="w-1 h-4 bg-gradient-to-b from-red-600/50 to-red-700/50 rounded-full"></span>
          {session.title}
        </h3>
        <div className="space-y-2 text-gray-500 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gray-600/10 flex items-center justify-center shrink-0">
              <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <span className="font-medium">{session.month} {session.day}, {session.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gray-600/10 flex items-center justify-center shrink-0">
              <ClockIcon className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <span className="font-medium">{to12Hour(session.startTime)} - {to12Hour(session.endTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gray-600/10 flex items-center justify-center shrink-0">
              <LocationIcon className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <span className="font-medium truncate">{session.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


// ===== SESSIONS CONTENT =====

export const SessionsContent = ({ sessionsData, openCardMenuId, onCreateSession, onMenuToggle, onDeleteSession }) => {
  // Empty state when no sessions
  if (sessionsData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] animate-fadeIn">
        <div className="text-center">
          {/* Animated circle with pulsing effect */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-indigo-600/20 rounded-full animate-ping"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 rounded-full flex items-center justify-center border-2 border-indigo-500/40 shadow-2xl shadow-indigo-500/30">
              <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">No Sessions Yet</h3>
          <p className="text-gray-400 text-sm mb-1">Click the <span className="text-indigo-400 font-semibold">+</span> button to create</p>
          <p className="text-gray-400 text-sm">your first study session</p>
          
          {/* Arrow pointing to FAB */}
          <div className="mt-8 flex justify-center">
            <div className="text-indigo-500/60 animate-bounce">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
      {/* Session Cards */}
      {sessionsData.map((session, index) => (
        <div key={`session-${session.id}-${session.deletedAt || ''}`} className="animate-fadeIn relative hover:z-10">
          <SessionCard
            session={session}
            openMenuId={openCardMenuId}
            onMenuToggle={onMenuToggle}
            onDelete={onDeleteSession}
          />
        </div>
      ))}
    </div>
  );
};

// ===== HISTORY SESSIONS CONTENT =====

export const HistorySessionsContent = ({ historySessions, onBackToSessions }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between animate-slideInLeft">
        <div>
          <h3 className="text-white text-xl font-bold tracking-tight">Session History</h3>
          <p className="text-gray-400 text-sm mt-1">Completed sessions from your past</p>
        </div>
        <button
          onClick={onBackToSessions}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-lg"
        >
          ← Back to Sessions
        </button>
      </div>
      {historySessions.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-gray-700 rounded-2xl p-12 text-center text-gray-400 animate-fadeIn">
          <div className="text-5xl mb-4 opacity-50">📚</div>
          <p className="text-base">No completed sessions yet.</p>
          <p className="text-sm text-gray-500 mt-2">Your completed sessions will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {historySessions.map((session, index) => (
            <div 
              key={`history-${session.id}`} 
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div 
                onClick={() => navigate(`/session/${session.id}`)}
                className="bg-[#161A2B] border border-gray-700/50 hover:border-indigo-500/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/30 cursor-pointer group h-[180px] w-full hover:scale-[1.02] relative"
              >
                {/* Session Thumbnail with "Completed" badge */}
                <div className="relative h-[90px] bg-gradient-to-br from-green-700 to-green-800 overflow-hidden group-hover:brightness-110 transition-all">
                  <div className="absolute inset-0 bg-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Completed Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <div className="backdrop-blur-sm bg-black/30 rounded-lg px-2.5 py-1 border border-green-400/30 flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-xs font-bold">COMPLETED</span>
                    </div>
                  </div>

                  {/* Privacy Indicator */}
                    {session.sessionPrivacy === 'PRIVATE' && (
                    <div className="absolute top-2 left-28 flex items-center px-2 py-1 bg-black/30 backdrop-blur-sm rounded-lg border border-yellow-500/30">
                      <LockIcon className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400 ml-1 font-semibold">Private</span>
                    </div>
                  )}

                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-16 h-16 bg-white/10 rounded-full"></div>
                    <div className="absolute bottom-4 right-4 w-20 h-20 bg-white/10 rounded-full"></div>
                  </div>
                </div>

                {/* Session Info */}
                <div className="p-4 bg-[#0a0a0a]/80 backdrop-blur-sm relative">
                  {/* Top gradient accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>
                  
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-white font-bold text-sm group-hover:text-green-400 transition-colors flex-1 line-clamp-1 flex items-center gap-2">
                      <span className="w-1 h-4 bg-gradient-to-b from-green-600 to-green-700 rounded-full group-hover:h-5 transition-all"></span>
                      {session.title}
                    </h3>
                    {session.tags && session.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-end flex-shrink-0 max-w-[40%]">
                        {session.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-indigo-600/20 border border-indigo-500/50 text-indigo-300 px-1.5 py-0.5 rounded-full text-[9px] whitespace-nowrap"
                          >
                            {tag}
                          </span>
                        ))}
                        {session.tags.length > 2 && (
                          <span className="text-gray-400 text-[9px]">+{session.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-xs group-hover:text-gray-300 transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-green-600/10 flex items-center justify-center group-hover:bg-green-600/20 transition-colors shrink-0">
                        <CalendarIcon className="w-3.5 h-3.5 text-green-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="font-medium">{session.month} {session.day}, {session.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs group-hover:text-gray-300 transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-green-600/10 flex items-center justify-center group-hover:bg-green-600/20 transition-colors shrink-0">
                        <ClockIcon className="w-3.5 h-3.5 text-green-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="font-medium">{to12Hour(session.startTime)} - {to12Hour(session.endTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs group-hover:text-gray-300 transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-green-600/10 flex items-center justify-center group-hover:bg-green-600/20 transition-colors shrink-0">
                        <LocationIcon className="w-3.5 h-3.5 text-green-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="font-medium truncate">{session.location}</span>
                    </div>
                  </div>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ===== TRASHED SESSIONS CONTENT =====

export const TrashedSessionsContent = ({ trashedSessions, onRestore, onBackToSessions }) => {
  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between animate-slideInLeft">
        <h3 className="text-white text-xl font-bold tracking-tight">Trashed Sessions</h3>
        <button
          onClick={onBackToSessions}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-lg"
        >
          ← Back to Sessions
        </button>
      </div>
      {trashedSessions.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-gray-700 rounded-2xl p-12 text-center text-gray-400 animate-fadeIn">
          <div className="text-5xl mb-4 opacity-50">🗑️</div>
          <p className="text-base">No trashed sessions.</p>
          <p className="text-sm text-gray-500 mt-2">Sessions you move to trash will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {trashedSessions.map((session, index) => (
            <div key={`trashed-${session.id}`} className="animate-fadeIn">
              <TrashedSessionCard
                session={session}
                onRestore={onRestore}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default SessionsContent;