import React from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, MapPinIcon, UsersIcon, LockClosedIcon, GlobeIcon, CalendarIcon } from '../../icons';

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
    sessionType, 
    currentParticipants, 
    maxParticipants 
  } = session;
  
  const formatDate = () => {
    if (month && day && year) {
      return `${month} ${day}, ${year}`;
    }
    return 'TBD';
  };
  
  const getAvailabilityColor = () => {
    if (!maxParticipants) return 'text-green-400';
    const percentageFull = (currentParticipants / maxParticipants) * 100;
    if (percentageFull >= 90) return 'text-red-400';
    if (percentageFull >= 70) return 'text-yellow-400';
    return 'text-green-400';
  };
  
  const getAvailabilityBg = () => {
    if (!maxParticipants) return 'bg-green-500/10 border-green-500/30';
    const percentageFull = (currentParticipants / maxParticipants) * 100;
    if (percentageFull >= 90) return 'bg-red-500/10 border-red-500/30';
    if (percentageFull >= 70) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-green-500/10 border-green-500/30';
  };
  
  return (
    <Link 
      to={`/session/${id}`}
      className="group relative block bg-[#161A2B] rounded-xl border border-gray-800/50 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-2 overflow-hidden w-full will-change-transform"
    >
      {/* Thumbnail Image */}
      <div className="relative w-full h-32 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-blue-600/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDk5LDEwMiwyNDEsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#161A2B] via-transparent to-transparent"></div>
        
        {/* Privacy Badge on Image */}
        <div className="absolute top-3 right-3 z-10">
          {sessionType === 'PRIVATE' ? (
            <div className="px-3 py-1.5 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700/50 flex items-center gap-1.5">
              <LockClosedIcon className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-xs font-medium text-gray-300">Private</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-indigo-900/80 backdrop-blur-sm rounded-lg border border-indigo-500/50 flex items-center gap-1.5">
              <GlobeIcon className="w-3.5 h-3.5 text-indigo-300" />
              <span className="text-xs font-medium text-indigo-300">Public</span>
            </div>
          )}
        </div>
        
        {/* Availability Badge on Image */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className={`px-3 py-1.5 backdrop-blur-sm rounded-lg border flex items-center gap-1.5 ${getAvailabilityBg()}`}>
            <UsersIcon className={`w-3.5 h-3.5 ${getAvailabilityColor()}`} />
            <span className={`text-xs font-bold ${getAvailabilityColor()}`}>
              {currentParticipants || 0}/{maxParticipants || '∞'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Card Content with Padding */}
      <div className="relative z-10 p-4 space-y-3 h-full flex flex-col">
        {/* Animated gradient overlay on hover */}
        <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-all duration-700 pointer-events-none"></div>
        
        {/* Decorative blur orbs */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-indigo-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        {/* Header */}
        <div className="relative z-10">
          <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors duration-300 line-clamp-2 leading-snug mb-1">
            {title}
          </h3>
          <p className="text-[11px] text-gray-400 group-hover:text-gray-300 transition-colors line-clamp-1">
            by <span className="text-indigo-400 font-medium">{hostName || 'Unknown'}</span>
          </p>
        </div>
        
        {/* Description */}
        {description && (
          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed group-hover:text-gray-300 transition-colors">
            {description}
          </p>
        )}
        
        {/* Details */}
        <div className="space-y-2.5 flex-1 relative z-10">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center group-hover:bg-indigo-600/20 transition-colors flex-shrink-0">
              <CalendarIcon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white font-medium group-hover:text-indigo-300 transition-colors truncate">
                {formatDate()}
              </div>
              <div className="text-gray-500 group-hover:text-gray-400 transition-colors truncate">
                {startTime || 'TBD'} - {endTime || 'TBD'}
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
        </div>
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-800/50 group-hover:border-indigo-500/20 transition-colors relative z-10">
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
      </div>
        
      {/* Arrow indicator */}
      <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1 z-20">
        <svg 
          className="w-5 h-5 text-indigo-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
};

export default SessionCard;
