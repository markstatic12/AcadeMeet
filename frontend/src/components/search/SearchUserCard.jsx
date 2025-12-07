import React from 'react';
import { Link } from 'react-router-dom';
import { UserIcon } from '../../icons';

const SearchUserCard = ({ user }) => {
  const { id, name, program, studentId, profileImageUrl } = user;
  
  return (
    <Link 
      to={`/profile/${id}`} 
      className="group relative flex items-center gap-3 p-4 bg-[#161A2B] hover:bg-[#1a1f35] rounded-xl transition-all duration-300 border border-gray-800/50 hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-2 overflow-hidden w-full will-change-transform"
    >
      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-all duration-500 pointer-events-none"></div>
      
      {/* Decorative blur orbs */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative z-10 flex items-center gap-4 w-full">
        {/* Avatar */}
        <div className="flex-shrink-0 relative">
          {profileImageUrl ? (
            <div className="relative">
              <img 
                src={profileImageUrl} 
                alt={name} 
                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-700 group-hover:ring-indigo-500 transition-all duration-300"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#161A2B] group-hover:scale-110 transition-transform"></div>
            </div>
          ) : (
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-gray-700 group-hover:ring-indigo-500 transition-all duration-300 group-hover:scale-110">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#161A2B] animate-pulse"></div>
            </div>
          )}
        </div>
        
        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm mb-0.5 group-hover:text-indigo-300 transition-colors duration-300 truncate">
            {name}
          </h3>
          <p className="text-gray-400 text-xs mb-0.5 group-hover:text-gray-300 transition-colors duration-300 truncate">
            {program}
          </p>
          <p className="text-gray-500 text-[11px] group-hover:text-gray-400 transition-colors duration-300 truncate">
            {studentId}
          </p>
        </div>
        
        {/* Arrow Icon */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
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

export default SearchUserCard;
