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

  return (
    <div 
      onClick={handleClick}
      className="bg-[#161A2B] border border-gray-700/50 hover:border-indigo-500/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/30 cursor-pointer group h-[180px] w-full hover:scale-[1.02] relative"
    >
      {/* Session Thumbnail */}
      <div className="relative h-[90px] bg-gradient-to-br from-indigo-600 to-indigo-700 overflow-hidden group-hover:brightness-110 transition-all">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Status and Privacy Indicators */}
        <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
          <div className="backdrop-blur-sm bg-black/20 rounded-lg px-2 py-1 border border-white/10">
            <SessionStatusBadge status={session.status || 'ACTIVE'} />
          </div>
          {session.sessionType === 'PRIVATE' && (
            <div className="flex items-center px-2 py-1 bg-black/30 backdrop-blur-sm rounded-lg border border-yellow-500/30">
              <LockIcon className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-yellow-400 ml-1 font-semibold">Private</span>
            </div>
          )}
        </div>
        
        {/* Card menu */}
        <div className="absolute top-2 right-2 card-options-menu z-20">
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              onMenuToggle(session.id); 
            }}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white/90 hover:text-white transition-all hover:scale-110 backdrop-blur-md border border-white/10"
            title="Options"
          >
            <ThreeDotsVerticalIcon className="w-4 h-4" />
          </button>
          {openMenuId === session.id && (
            <div className="absolute right-0 mt-2 w-40 bg-[#111] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-slideDown backdrop-blur-xl">
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onDelete(session.id); 
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-600/20 flex items-center gap-2 transition-all group/delete font-medium"
              >
                <TrashIcon className="w-4 h-4 group-hover/delete:scale-110 transition-transform" />
                <span>Trash</span>
              </button>   
            </div>
          )}
        </div>
        
        {/* Colorful shapes pattern - LEFT SIDE */}
        <div className="absolute left-0 top-0 w-1/2 h-full pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
          {/* Row 1 */}
          <div className="absolute top-2 left-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-white text-[8px] font-bold shadow-lg group-hover:scale-110 transition-transform">B</div>
          <div className="absolute top-2 left-10 w-5 h-5 bg-orange-500 rounded shadow-lg group-hover:rotate-12 transition-transform"></div>
          <div className="absolute top-3 left-16 w-4 h-4 bg-cyan-400 rounded shadow-lg group-hover:-rotate-12 transition-transform"></div>
          
          {/* Row 2 */}
          <div className="absolute top-8 left-2 w-5 h-5 bg-blue-500 rounded shadow-lg group-hover:scale-110 transition-transform"></div>
          <div className="absolute top-7 left-9 w-6 h-6 bg-yellow-400 rounded transform rotate-12 shadow-lg group-hover:rotate-45 transition-transform"></div>
          <div className="absolute top-8 left-16 w-5 h-5 bg-purple-500 rounded shadow-lg group-hover:scale-110 transition-transform"></div>
          
          {/* Row 3 */}
          <div className="absolute top-14 left-2 w-5 h-5 bg-pink-500 rounded-full shadow-lg group-hover:scale-110 transition-transform"></div>
          <div className="absolute top-13 left-9 w-5 h-5 bg-red-500 rounded shadow-lg group-hover:-rotate-12 transition-transform"></div>
          <div className="absolute top-14 left-15 w-4 h-4 bg-yellow-300 rounded-full shadow-lg group-hover:scale-110 transition-transform"></div>
        </div>
        
        {/* Pink diamond accent - CENTER TOP */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 pointer-events-none">
          <div className="w-7 h-7 bg-pink-500 rounded transform rotate-45 shadow-xl group-hover:rotate-90 group-hover:scale-110 transition-all duration-500"></div>
        </div>
        
        {/* Phone illustration - RIGHT BOTTOM */}
        <div className="absolute bottom-0 right-0 w-1/2 h-full flex items-end justify-end p-2 pointer-events-none">
          <div className="relative group-hover:scale-110 transition-transform">
            <div className="w-20 h-16 bg-[#1e40af] rounded-lg border-2 border-[#1e3a8a] shadow-2xl"></div>
            <div className="absolute top-1 left-1 right-1 bottom-1 bg-[#2563eb] rounded"></div>
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-r-2 border-b-2 border-white/30 rounded-br-lg"></div>
          </div>
        </div>
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
      </div>

      {/* Session Info */}
      <div className="p-3 bg-[#161A2B] transition-all relative">
        {/* Top gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
        
        <h3 className="text-white font-bold text-xs mb-2 group-hover:text-indigo-300 transition-colors truncate flex items-center gap-1.5">
          <span className="w-0.5 h-3 bg-gradient-to-b from-indigo-600 to-indigo-700 rounded-full group-hover:h-4 transition-all"></span>
          {session.title}
        </h3>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] group-hover:text-gray-300 transition-colors">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/10 flex items-center justify-center group-hover:bg-indigo-600/20 transition-colors">
              <CalendarIcon className="w-3 h-3 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-medium">{session.month} {session.day}, {session.year}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] group-hover:text-gray-300 transition-colors">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/10 flex items-center justify-center group-hover:bg-indigo-600/20 transition-colors">
              <ClockIcon className="w-3 h-3 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-medium">{to12Hour(session.startTime)} - {to12Hour(session.endTime)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] group-hover:text-gray-300 transition-colors">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/10 flex items-center justify-center group-hover:bg-indigo-600/20 transition-colors">
              <LocationIcon className="w-3 h-3 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-medium truncate">{session.location}</span>
          </div>
          {session.maxParticipants && (
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] group-hover:text-gray-300 transition-colors">
              <div className="w-6 h-6 rounded-lg bg-green-600/10 flex items-center justify-center group-hover:bg-green-600/20 transition-colors">
                <span className="text-xs">👥</span>
              </div>
              <span className="font-medium">{session.currentParticipants || 0}/{session.maxParticipants} participants</span>
            </div>
          )}
        </div>
        
        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
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
      
      <div className="p-3 bg-[#161A2B]">
        <h3 className="text-white/60 font-bold text-xs mb-1.5 line-through">{session.title}</h3>
        <div className="space-y-0.5 text-gray-600 text-[10px]">"
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="w-2.5 h-2.5 text-gray-600" />
            <span>{session.month} {session.day}, {session.year}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ClockIcon className="w-2.5 h-2.5 text-gray-600" />
            <span>{to12Hour(session.startTime)} - {to12Hour(session.endTime)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <LocationIcon className="w-2.5 h-2.5 text-gray-600" />
            <span>{session.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


// ===== SESSIONS CONTENT =====

export const SessionsContent = ({ sessionsData, openCardMenuId, onCreateSession, onMenuToggle, onDeleteSession }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full flex-1 min-h-0 overflow-y-auto custom-scrollbar pt-2 pb-4">
      {/* Create New Session Card */}
      <div className="animate-fadeIn">
        <CreateNewCard onClick={onCreateSession} label="Create New Session" />
      </div>

      {/* Session Cards - All animate together */}
      {sessionsData.map((session, index) => (
        <div key={`session-${session.id}-${session.deletedAt || ''}`} className="animate-fadeIn">
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

// ===== TRASHED SESSIONS CONTENT =====

export const TrashedSessionsContent = ({ trashedSessions, onRestore, onBackToSessions }) => {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pt-2 pb-4">
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