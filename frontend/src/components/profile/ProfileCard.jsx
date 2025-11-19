import React from 'react';

const ProfileCard = React.forwardRef(({ userData, onManageFollowers }, ref) => {
  return (
    <div ref={ref} className="relative bg-[#1f1f1f] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Profile Banner with Avatar */}
      <div className="relative h-44 overflow-visible">
        {userData?.coverImage ? (
          <img src={userData.coverImage} alt="cover" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#3949ab] via-[#5e6bbf] to-[#7986cb]" />
        )}
        {/* Diagonal white sweep */}
        <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-br from-white/40 to-transparent transform skew-x-[-20deg] translate-x-12"></div>
        
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-24 h-24 bg-[#0f0f0f] rounded-full p-1 overflow-hidden ring-4 ring-[#1f1f1f]">
            {userData?.profilePic ? (
              <img src={userData.profilePic} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            )}
          </div>
          {userData.isOnline && (
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-[#0f0f0f] z-20"></div>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-16 px-6 pb-6">
        {/* User Info */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-white mb-1">{userData.name}</h2>
          <p className="text-gray-400 text-xs">
            {userData.school}, {userData.program}, {userData.studentId}
          </p>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <p className="text-gray-400 text-sm italic bg-gray-800/50 border border-gray-700 rounded-lg p-4 min-h-[120px]">
            {userData.bio}
          </p>
        </div>

        {/* Followers & Following */}
        <div className="flex justify-center gap-8 mb-4 py-3 border-y border-gray-800">
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">Followers</p>
            <p className="text-xl font-bold text-white">0</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">Following</p>
            <p className="text-xl font-bold text-white">0</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onManageFollowers}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            Manage Followers
          </button>
        </div>
      </div>
    </div>
  );
});

ProfileCard.displayName = 'ProfileCard';

export default ProfileCard;
