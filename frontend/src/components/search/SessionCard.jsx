import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, LocationIcon, LockIcon } from '../../icons';
import { to12Hour } from '../../utils/timeUtils';
import SessionStatusBadge from '../ui/SessionStatusBadge';

const SessionCard = ({ session }) => {
  const { 
    id, 
    title, 
    hostName,
    month,
    day,
    year,
    startTime, 
    endTime, 
    location, 
    description, 
    tags, 
    sessionPrivacy,
    status,
    currentParticipants, 
    maxParticipants 
  } = session;

  // Determine if session ends in AM or PM
  const endTime12 = to12Hour(endTime || '');
  const isPM = endTime12.toLowerCase().includes('pm');

  return (
    <Link 
      to={`/session/${id}`}
      className="block bg-[#161A2B] border border-gray-700/50 hover:border-indigo-500/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20 cursor-pointer group w-full"
    >
      {/* Elegant Header with Sophisticated Gradient */}
      <div className="relative p-4 bg-gradient-to-br from-gray-800/50 via-gray-850/40 to-gray-900/50 border-b border-gray-700/40 overflow-hidden">
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-600/8 to-gray-600/8 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-gradient-to-tr from-gray-700/8 to-violet-700/8 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        
        {/* Minimal decorative accents */}
        <div className="absolute top-3 right-6 w-1.5 h-1.5 bg-violet-400/15 rounded-full"></div>
        <div className="absolute bottom-3 left-6 w-1 h-1 bg-gray-400/15 rounded-full"></div>
        
        {/* Subtle shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1500"></div>
        
        {/* Status and Privacy Indicators */}
        <div className="flex items-center gap-2 mb-3 relative z-10 flex-wrap">
          {status && <SessionStatusBadge status={status} />}
          {sessionPrivacy === 'PRIVATE' ? (
            <div className="flex items-center px-2.5 py-1 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-sm">
              <LockIcon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-300 ml-1.5 font-medium">Private</span>
            </div>
          ) : (
            <div className="flex items-center px-2.5 py-1 bg-indigo-900/30 backdrop-blur-sm rounded-lg border border-indigo-500/30 shadow-sm">
              <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-indigo-400 ml-1.5 font-medium">Public</span>
            </div>
          )}
        </div>
        
        {/* Title with subtle hover effect */}
        <h3 className="text-white font-semibold text-lg group-hover:text-gray-100 transition-colors line-clamp-1 relative z-10 mb-1">
          {title}
        </h3>
        {hostName && (
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors line-clamp-1 relative z-10">
            by <span className="text-indigo-400 font-medium">{hostName}</span>
          </p>
        )}
      </div>

      {/* Session Info */}
      <div className="p-4 bg-gradient-to-br from-[#161A2B] to-[#1a1f35]/95 transition-all relative">
        <div className="space-y-3">
          {/* Date with sophisticated rose/coral */}
          <div className="flex items-center gap-3 text-gray-300 text-sm group-hover:text-rose-200 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-600/18 to-rose-700/12 flex items-center justify-center group-hover:from-rose-600/22 group-hover:to-rose-700/16 transition-colors shrink-0 border border-rose-600/15">
              <CalendarIcon className="w-4 h-4 text-rose-400/90 group-hover:scale-105 transition-transform" />
            </div>
            <span className="font-medium">{month} {day}, {year}</span>
          </div>
          {sessionPrivacy === 'PRIVATE' ? (
            <>
              {/* Blurred/Locked details for private sessions */}
              <div className="relative">
                <div className="space-y-3 blur-[2px] select-none pointer-events-none opacity-40">
                  <div className="flex items-center gap-3 text-gray-500 text-sm">
                    <div className="w-9 h-9 rounded-lg bg-gray-600/10 flex items-center justify-center">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                    </div>
                    <span>••:•• •• - ••:•• ••</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500 text-sm">
                    <div className="w-9 h-9 rounded-lg bg-gray-600/10 flex items-center justify-center">
                      <LocationIcon className="w-4 h-4 text-gray-500" />
                    </div>
                    <span>••••••••••</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500 text-sm">
                    <div className="w-9 h-9 rounded-lg bg-gray-600/10 flex items-center justify-center">
                      <span className="text-base">👥</span>
                    </div>
                    <span>•/•• participants</span>
                  </div>
                </div>
                {/* Lock overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700/50 flex items-center gap-2 shadow-lg">
                    <LockIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300 font-medium">Private Details</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Time with elegant violet and subtle sun/moon indicator */}
              <div className="flex items-center gap-3 text-gray-300 text-sm group-hover:text-violet-200 transition-colors">
                <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600/18 to-violet-700/12 flex items-center justify-center group-hover:from-violet-600/22 group-hover:to-violet-700/16 transition-colors shrink-0 border border-violet-600/15">
                  <ClockIcon className="w-4 h-4 text-violet-400/90 group-hover:scale-105 transition-transform" />
                  {/* Subtle Sun/Moon indicator */}
                  {isPM ? (
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-gradient-to-br from-indigo-500/80 to-indigo-600/70 flex items-center justify-center border border-indigo-400/30">
                      <div className="text-[7px] opacity-80">🌙</div>
                    </div>
                  ) : (
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-gradient-to-br from-amber-400/80 to-amber-500/70 flex items-center justify-center border border-amber-300/30">
                      <div className="text-[7px] opacity-80">☀️</div>
                    </div>
                  )}
                </div>
                <span className="font-medium">{to12Hour(startTime)} - {to12Hour(endTime)}</span>
              </div>
              {/* Location with sophisticated emerald */}
              <div className="flex items-center gap-3 text-gray-300 text-sm group-hover:text-emerald-200 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600/18 to-emerald-700/12 flex items-center justify-center group-hover:from-emerald-600/22 group-hover:to-emerald-700/16 transition-colors shrink-0 border border-emerald-600/15">
                  <LocationIcon className="w-4 h-4 text-emerald-400/90 group-hover:scale-105 transition-transform" />
                </div>
                <span className="font-medium truncate">{location}</span>
              </div>
              {/* Participants with refined sky blue */}
              <div className="flex items-center gap-3 text-gray-300 text-sm group-hover:text-sky-200 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-600/18 to-sky-700/12 flex items-center justify-center group-hover:from-sky-600/22 group-hover:to-sky-700/16 transition-colors shrink-0 border border-sky-600/15">
                  <span className="text-base">👥</span>
                </div>
                <span className="font-medium">{currentParticipants || 0}/{maxParticipants || '∞'} participants</span>
              </div>
            </>
          )}
        </div>
        
        {/* Refined bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </Link>
  );
};

export default SessionCard;
