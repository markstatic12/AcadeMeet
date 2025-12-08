import React from 'react';
import { CalendarIcon, ClockIcon, LocationIcon, LockIcon } from '../../icons';
import { to12Hour } from '../../utils/timeUtils';
// SessionStatusBadge lives in the shared ui folder
import SessionStatusBadge from '../ui/SessionStatusBadge';

const SessionDetailsCard = ({ session, onJoinClick, showJoinButton = true }) => {
  const isPrivate = session.sessionType === 'PRIVATE';
  const isActive = session.status === 'ACTIVE' || session.status === 'SCHEDULED';

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
      {/* Header with Status and Privacy */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white mb-2">{session.title}</h2>
          <div className="flex items-center gap-3">
            <SessionStatusBadge status={session.status} />
            {isPrivate && (
              <div className="flex items-center px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                <LockIcon className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-xs text-yellow-400 font-medium">Private Session</span>
              </div>
            )}
          </div>
        </div>
        {session.profileImageUrl && (
          <img
            src={session.profileImageUrl}
            alt="Session"
            className="w-16 h-16 rounded-lg object-cover"
          />
        )}
      </div>

      {/* Session Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-gray-300">
          <CalendarIcon className="w-5 h-5 text-indigo-400" />
          <span>{session.month} {session.day}, {session.year}</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-300">
          <ClockIcon className="w-5 h-5 text-indigo-400" />
          <span>{to12Hour(session.startTime)} - {to12Hour(session.endTime)}</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-300">
          <LocationIcon className="w-5 h-5 text-indigo-400" />
          <span>{session.location}</span>
        </div>

        {/* Participant Info */}
        {session.maxParticipants && (
          <div className="flex items-center gap-3 text-gray-300">
            <span className="text-indigo-400">👥</span>
            <span>
              {session.currentParticipants || 0} / {session.maxParticipants} participants
              {session.maxParticipants - (session.currentParticipants || 0) === 0 && (
                <span className="text-orange-400 ml-2">(Full)</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {session.description && (
        <div className="mb-6">
          <h4 className="text-white font-medium mb-2">Description</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{session.description}</p>
        </div>
      )}

      {/* Host Information */}
      {session.host && (
        <div className="mb-6">
          <h4 className="text-white font-medium mb-2">Hosted by</h4>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {session.host.name?.charAt(0) || 'H'}
              </span>
            </div>
            <span className="text-gray-300">{session.host.name}</span>
          </div>
        </div>
      )}

      {/* Join Button */}
      {showJoinButton && isActive && (
        <div className="pt-4 border-t border-gray-800">
          <button
            onClick={() => onJoinClick(session)}
            className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              isPrivate
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isPrivate && <LockIcon className="w-4 h-4" />}
            {isPrivate ? 'Join Private Session' : 'Join Session'}
          </button>
        </div>
      )}

      {/* Status Messages */}
      {!isActive && (
        <div className="pt-4 border-t border-gray-800">
          <div className="text-center py-3">
            <p className="text-gray-400 text-sm">
              {session.status === 'COMPLETED' && 'This session has ended'}
              {session.status === 'CANCELLED' && 'This session has been cancelled'}
              {session.status === 'DELETED' && 'This session is no longer available'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionDetailsCard;