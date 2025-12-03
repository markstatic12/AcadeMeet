import React from 'react';
import { Link } from 'react-router-dom';
import { UserIcon } from '../../icons';

const SearchUserCard = ({ user }) => {
  const { id, name, program, studentId, profileImageUrl } = user;
  
  return (
    <Link 
      to={`/profile/${id}`} 
      className="flex items-center gap-4 p-5 bg-[#2a2a2a] hover:bg-[#333333] rounded-2xl transition-all border border-gray-800"
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {profileImageUrl ? (
          <img 
            src={profileImageUrl} 
            alt={name} 
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative">
            <UserIcon className="w-7 h-7 text-white" />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#2a2a2a]"></div>
          </div>
        )}
      </div>
      
      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold text-lg mb-1">
          {name}
        </h3>
        <p className="text-gray-400 text-sm mb-0.5">
          {program}
        </p>
        <p className="text-gray-500 text-sm">
          {studentId}
        </p>
      </div>
    </Link>
  );
};

export default SearchUserCard;
