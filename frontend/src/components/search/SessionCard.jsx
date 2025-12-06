import React from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, MapPinIcon, UsersIcon, LockClosedIcon, GlobeIcon, CalendarIcon } from '../../icons';

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
  
  const getAvailabilityBg = () => {
    const percentageFull = (participants / maxParticipants) * 100;
    if (percentageFull >= 90) return 'bg-red-500/10 border-red-500/30';
    if (percentageFull >= 70) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-green-500/10 border-green-500/30';
  };
  
  return (
    <Link 
      to={`/session/${id}`} 
      className="group relative block bg-[#161A2B] hover:bg-[#1a1f35] border border-gray-800/50 hover:border-indigo-500/60 rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-[1.02] overflow-hidden h-full"
    >
      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-all duration-700 pointer-events-none"></div>
      
      {/* Decorative blur orbs */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-indigo-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent group-hover:via-indigo-500 transition-all duration-300"></div>
      
      <div className="relative z-10 space-y-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors duration-300 line-clamp-2 leading-snug">
                {title}
              </h3>
            </div>
            
            <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors line-clamp-1">
              by <span className="text-indigo-400 font-medium">{host?.name || 'Unknown'}</span>
            </p>
          </div>
          
          {/* Privacy Badge */}
          <div className="flex-shrink-0">
            {sessionType === 'PRIVATE' ? (
              <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-gray-700/50 transition-colors">
                <LockClosedIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
              </div>
            ) : (
              <div className="p-2 bg-indigo-600/10 rounded-lg group-hover:bg-indigo-600/20 transition-colors">
                <GlobeIcon className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
              </div>
            )}
          </div>
        </div>
        
        {/* Description */}
        {description && (
          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed group-hover:text-gray-300 transition-colors">
            {description}
          </p>
        )}
        
        {/* Details */}
        <div className="space-y-2.5 flex-1">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center group-hover:bg-indigo-600/20 transition-colors flex-shrink-0">
              <CalendarIcon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white font-medium group-hover:text-indigo-300 transition-colors truncate">
                {formatDate(startTime)}
              </div>
              <div className="text-gray-500 group-hover:text-gray-400 transition-colors truncate">
                {formatTime(startTime)} - {formatTime(endTime)}
              </div>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center group-hover:bg-indigo-600/20 transition-colors flex-shrink-0">
              <MapPinIcon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white font-medium group-hover:text-indigo-300 transition-colors truncate">
                {location}
              </div>
            </div>
          </div>
          
          {/* Participants */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center group-hover:bg-indigo-600/20 transition-colors flex-shrink-0">
              <UsersIcon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="min-w-0 flex-1">
              <div className={`font-bold ${getAvailabilityColor()} transition-colors`}>
                {participants} / {maxParticipants}
              </div>
              <div className="text-gray-500 group-hover:text-gray-400 transition-colors">
                Participants
              </div>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-800/50 group-hover:border-indigo-500/20 transition-colors">
            {tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-medium rounded-md border border-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-colors truncate"
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-800/50 text-gray-400 text-[10px] font-medium rounded-md border border-gray-700/50">
                +{tags.length - 2}
              </span>
            )}
          </div>
        )}
        
        {/* Arrow indicator */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
          <svg 
            className="w-5 h-5 text-indigo-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default SessionCard;
          
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
