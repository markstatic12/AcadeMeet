import React from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, MapPinIcon, UsersIcon, LockClosedIcon, GlobeIcon } from '../../icons';

const SessionCard = ({ session }) => {
  const { 
    id, 
    title, 
    host, 
    startTime, 
    endTime, 
    location, 
    description, 
    tags, 
    sessionType, 
    participants, 
    maxParticipants 
  } = session;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  const getAvailabilityColor = () => {
    const percentageFull = (participants / maxParticipants) * 100;
    if (percentageFull >= 90) return 'text-red-400';
    if (percentageFull >= 70) return 'text-yellow-400';
    return 'text-green-400';
  };
  
  return (
    <Link 
      to={`/session/${id}`} 
      className="block bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700 hover:border-indigo-500/50 rounded-lg p-5 transition-all group"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                {title}
              </h3>
              {sessionType === 'PRIVATE' ? (
                <LockClosedIcon className="w-4 h-4 text-gray-400" />
              ) : (
                <GlobeIcon className="w-4 h-4 text-gray-400" />
              )}
            </div>
            
            <p className="text-sm text-gray-400">
              Hosted by <span className="text-indigo-400 font-medium">{host.name}</span>
              <span className="text-gray-600 mx-2">•</span>
              <span className="text-gray-500">{host.program}</span>
            </p>
          </div>
          
          {/* Arrow Icon */}
          <div className="flex-shrink-0">
            <svg 
              className="w-5 h-5 text-gray-600 group-hover:text-indigo-500 transition-colors" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* Description */}
        {description && (
          <p className="text-gray-300 text-sm line-clamp-2">
            {description}
          </p>
        )}
        
        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <ClockIcon className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-white font-medium">{formatDate(startTime)}</div>
              <div className="text-xs">{formatTime(startTime)} - {formatTime(endTime)}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPinIcon className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-white font-medium">Location</div>
              <div className="text-xs">{location}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <UsersIcon className="w-4 h-4 text-gray-500" />
            <div>
              <div className={`font-medium ${getAvailabilityColor()}`}>
                {participants} / {maxParticipants}
              </div>
              <div className="text-xs">Participants</div>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded-md border border-indigo-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default SessionCard;
