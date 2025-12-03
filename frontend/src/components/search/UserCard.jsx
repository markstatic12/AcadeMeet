import React from 'react';
import { Link } from 'react-router-dom';
import { UserIcon, MailIcon, BookOpenIcon } from '../../icons';

const UserCard = ({ user }) => {
  const { id, name, email, program, yearLevel, bio, profileImageUrl, followers, following } = user;
  
  return (
    <Link 
      to={`/profile/${id}`} 
      className="block bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700 hover:border-indigo-500/50 rounded-lg p-5 transition-all group"
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {profileImageUrl ? (
            <img 
              src={profileImageUrl} 
              alt={name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-700 group-hover:border-indigo-500 transition-colors"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-gray-700 group-hover:border-indigo-500 transition-colors">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
        
        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors mb-1">
                {name}
              </h3>
              
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <MailIcon className="w-4 h-4" />
                  <span>{email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpenIcon className="w-4 h-4" />
                  <span>{program}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span>Year {yearLevel}</span>
              </div>
              
              {bio && (
                <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                  {bio}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-400">
                  <span className="font-semibold text-white">{followers}</span> Followers
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">
                  <span className="font-semibold text-white">{following}</span> Following
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Arrow Icon */}
        <div className="flex-shrink-0 self-center">
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
    </Link>
  );
};

export default UserCard;
