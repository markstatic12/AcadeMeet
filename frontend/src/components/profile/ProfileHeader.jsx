import React, { useState } from 'react';
import { CloseIcon, LoadingIcon } from '../../icons';

// ===== EDIT PROFILE MODAL =====

export const EditProfileModal = ({ 
  isOpen, 
  editForm, 
  isEditing, 
  onInputChange, 
  onClose, 
  onSave 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl p-8 max-w-2xl w-full shadow-2xl animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Edit Profile</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={onInputChange}
              dir="ltr"
              style={{ direction: 'ltr', unicodeBidi: 'normal', textAlign: 'left' }}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter your full name"
            />
          </div>

          {/* School */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              School
            </label>
            <input
              type="text"
              name="school"
              value={editForm.school}
              onChange={onInputChange}
              dir="ltr"
              style={{ direction: 'ltr', unicodeBidi: 'normal', textAlign: 'left' }}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter your school name"
            />
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Student ID
            </label>
            <input
              type="text"
              name="studentId"
              value={editForm.studentId}
              onChange={onInputChange}
              dir="ltr"
              style={{ direction: 'ltr', unicodeBidi: 'normal', textAlign: 'left' }}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter your student ID"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={editForm.bio}
              onChange={onInputChange}
              dir="ltr"
              style={{ direction: 'ltr', unicodeBidi: 'normal', textAlign: 'left' }}
              rows="4"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            disabled={isEditing}
            className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isEditing}
            className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isEditing ? (
              <>
                <LoadingIcon className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


// ===== FOLLOWERS MODAL =====

export const FollowersModal = ({ 
  isOpen, 
  followTab, 
  followersList, 
  followingList, 
  onClose, 
  onTabChange, 
  onRemoveFollower, 
  onUnfollow 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white">Manage Followers</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex gap-3 mb-5">
          <button
            onClick={() => onTabChange('followers')}
            className={`px-4 py-2 rounded-xl text-sm border ${
              followTab === 'followers'
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
            }`}
          >
            Followers
          </button>
          <button
            onClick={() => onTabChange('following')}
            className={`px-4 py-2 rounded-xl text-sm border ${
              followTab === 'following'
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
            }`}
          >
            Following
          </button>
        </div>
        <div className="max-h-[55vh] overflow-y-auto custom-scrollbar pr-1 divide-y divide-gray-800">
          {(followTab === 'followers' ? followersList : followingList).length === 0 ? (
            <div className="text-gray-400 text-sm p-6 text-center">
              No {followTab} yet.
            </div>
          ) : (
            (followTab === 'followers' ? followersList : followingList).map(u => (
              <div key={u.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                    {u.profilePic ? (
                      <img src={u.profilePic} alt={u.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-300 text-xs font-semibold">
                        {(u.name || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{u.name || 'User'}</div>
                    <div className="text-gray-500 text-xs">@{u.id}</div>
                  </div>
                </div>
                {followTab === 'followers' ? (
                  <button
                    onClick={() => onRemoveFollower(u.id)}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-red-300 border border-red-500/30 text-xs"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={() => onUnfollow(u.id)}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-red-300 border border-red-500/30 text-xs"
                  >
                    Unfollow
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ===== PROFILE CARD =====

export const ProfileCard = React.forwardRef(({ userData, onManageFollowers }, ref) => {
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