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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn p-4">
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-scaleIn overflow-hidden">
        {/* Decorative background elements - subtle indigo only */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white tracking-tight">Edit Profile</h3>
            <button
              onClick={onClose}
              className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all hover:rotate-90 hover:scale-110 border border-transparent hover:border-gray-700"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Full Name */}
            <div className="animate-slideInLeft" style={{ animationDelay: '0.05s' }}>
              <label className="block text-sm font-bold text-gray-300 mb-2.5 flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
                  <svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                Full Name
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={onInputChange}
                  dir="ltr"
                  style={{ direction: 'ltr', unicodeBidi: 'normal', textAlign: 'left' }}
                  className="w-full px-4 py-3.5 bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-gray-600 hover:shadow-lg hover:shadow-indigo-500/10"
                  placeholder="Enter your full name"
                />
                <div className="absolute inset-0 rounded-xl bg-indigo-600/0 group-focus-within:bg-indigo-600/10 pointer-events-none transition-all duration-500"></div>
              </div>
            </div>

            {/* School */}
            <div className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-bold text-gray-300 mb-2.5 flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
                  <svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                </div>
                School
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="school"
                  value={editForm.school}
                  onChange={onInputChange}
                  dir="ltr"
                  style={{ direction: 'ltr', unicodeBidi: 'normal', textAlign: 'left' }}
                  className="w-full px-4 py-3.5 bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-gray-600 hover:shadow-lg hover:shadow-indigo-500/10"
                  placeholder="Enter your school name"
                />
                <div className="absolute inset-0 rounded-xl bg-indigo-600/0 group-focus-within:bg-indigo-600/10 pointer-events-none transition-all duration-500"></div>
              </div>
            </div>

            {/* Program */}
            {/* Year Level */}
           

            {/* Bio */}
            <div className="animate-slideInLeft" style={{ animationDelay: '0.15s' }}>
              <label className="block text-sm font-bold text-gray-300 mb-2.5 flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
                  <svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                Bio
              </label>
              <div className="relative group">
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={onInputChange}
                  dir="ltr"
                  style={{ direction: 'ltr', unicodeBidi: 'normal', textAlign: 'left' }}
                  rows="5"
                  className="w-full px-4 py-3.5 bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none hover:border-gray-600 hover:shadow-lg hover:shadow-indigo-500/10"
                  placeholder="Tell us about yourself..."
                />
                <div className="absolute inset-0 rounded-xl bg-indigo-600/0 group-focus-within:bg-indigo-600/10 pointer-events-none transition-all duration-500"></div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <button
              onClick={onClose}
              disabled={isEditing}
              className="flex-1 relative overflow-hidden px-6 py-3.5 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 border border-gray-700 hover:border-gray-600 shadow-lg group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></div>
              <span className="relative z-10">Cancel</span>
            </button>
            <button
              onClick={onSave}
              disabled={isEditing}
              className="flex-1 relative overflow-hidden px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-bold transition-all shadow-xl shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:shadow-indigo-500/60 hover:scale-105 group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></div>
              {isEditing ? (
                <span className="relative z-10 flex items-center">
                  <LoadingIcon className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </span>
              )}
            </button>
          </div>
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 rounded-3xl p-8 w-full max-w-2xl shadow-2xl shadow-indigo-500/10 animate-scaleIn overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold text-white tracking-tight">Manage Followers</h3>
            <button
              onClick={onClose}
              className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all hover:rotate-90 hover:scale-110 border border-transparent hover:border-gray-700"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => onTabChange('followers')}
              className={`relative overflow-hidden px-6 py-3 rounded-xl text-sm font-bold border transition-all ${
                followTab === 'followers'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-500 shadow-xl shadow-indigo-500/40 scale-105'
                  : 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 border-gray-700 hover:from-gray-700 hover:to-gray-800 hover:border-gray-600'
              } group/tab`}
            >
              {followTab === 'followers' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              )}
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
                Followers
              </span>
            </button>
            <button
              onClick={() => onTabChange('following')}
              className={`relative overflow-hidden px-6 py-3 rounded-xl text-sm font-bold border transition-all ${
                followTab === 'following'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-500 shadow-xl shadow-indigo-500/40 scale-105'
                  : 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 border-gray-700 hover:from-gray-700 hover:to-gray-800 hover:border-gray-600'
              } group/tab`}
            >
              {followTab === 'following' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              )}
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
                </svg>
                Following
              </span>
            </button>
          </div>
          
          <div className="max-h-[55vh] overflow-y-auto custom-scrollbar pr-2 space-y-2">
            {(followTab === 'followers' ? followersList : followingList).length === 0 ? (
              <div className="text-gray-400 text-sm p-12 text-center bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-800">
                <div className="text-5xl mb-3 opacity-50">👥</div>
                <p className="text-base font-semibold">No {followTab} yet.</p>
                <p className="text-xs text-gray-500 mt-2">Start connecting with others!</p>
              </div>
            ) : (
              (followTab === 'followers' ? followersList : followingList).map((u, index) => (
                <div key={u.id} className="flex items-center justify-between p-3 hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 rounded-xl transition-all group border border-transparent hover:border-gray-700/50 animate-slideInLeft" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-110 group-hover:rotate-6 border-2 border-white/10">
                      {u.profilePic ? (
                        <img src={u.profilePic} alt={u.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-sm font-bold">
                          {(u.name || 'U').charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div>
                      <div className="text-white text-sm font-bold group-hover:text-indigo-400 transition-all">{u.name || 'User'}</div>
                      <div className="text-gray-500 text-xs font-medium">@{u.id}</div>
                    </div>
                  </div>
                  {followTab === 'followers' ? (
                    <button
                      onClick={() => onRemoveFollower(u.id)}
                      className="relative overflow-hidden px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 hover:from-red-600/30 hover:to-red-700/30 text-red-300 border border-red-500/40 hover:border-red-500/60 text-xs font-bold transition-all hover:scale-110 shadow-lg group/btn"
                    >
                      <span className="relative z-10 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Remove
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onUnfollow(u.id)}
                      className="relative overflow-hidden px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 hover:from-red-600/30 hover:to-red-700/30 text-red-300 border border-red-500/40 hover:border-red-500/60 text-xs font-bold transition-all hover:scale-110 shadow-lg group/btn"
                    >
                      <span className="relative z-10 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                        </svg>
                        Unfollow
                      </span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== PROFILE CARD =====

export const ProfileCard = React.forwardRef(({ userData, onManageFollowers }, ref) => {
  const [imageError, setImageError] = React.useState(false);
  
  return (
    <div ref={ref} className="relative bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl transition-all hover:shadow-indigo-500/10 hover:border-gray-700 group h-full flex flex-col">
      {/* Profile Banner with Avatar */}
      <div className="relative h-32 overflow-visible flex-shrink-0">
        {userData?.coverImage || userData?.coverImageUrl ? (
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={userData.coverImage || userData.coverImageUrl} 
              alt="cover" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/80"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-700 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 w-28 h-28 bg-indigo-500/10 rounded-full blur-3xl"></div>
          </div>
        )}
        
        {/* Diagonal white sweep with enhanced animation */}
        <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-br from-white/40 via-white/20 to-transparent transform skew-x-[-20deg] translate-x-12 group-hover:translate-x-16 transition-transform duration-700"></div>
        
        {/* Decorative corner accent */}
        <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-white/20 rounded-tr-2xl"></div>
        
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full p-1 overflow-hidden ring-4 ring-gray-800 shadow-2xl transition-all duration-300 group-hover:ring-indigo-500 group-hover:ring-6 group-hover:scale-110 group-hover:shadow-indigo-500/50">
              {userData?.profilePic || userData?.profileImageUrl ? (
                <img src={userData.profilePic || userData.profileImageUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center relative overflow-hidden">
                  <svg className="w-10 h-10 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
            </div>
            {userData.isOnline && (
              <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 rounded-full border-3 border-[#0f0f0f] z-20 shadow-lg shadow-green-500/50">
                <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-14 px-5 pb-5 flex flex-col flex-1">
        {/* User Info */}
        <div className="text-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-white mb-1.5 tracking-tight group-hover:text-indigo-400 transition-all duration-300">
            {userData.name}
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-1.5">
            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="leading-relaxed">{userData.school || 'CIT University'}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-xs text-indigo-300">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
            <span className="font-medium">{userData.program || 'Computer Science'}</span>
            {userData.yearLevel && (
              <span className="text-indigo-400">• {userData.yearLevel}{userData.yearLevel === 1 ? 'st' : userData.yearLevel === 2 ? 'nd' : userData.yearLevel === 3 ? 'rd' : 'th'} Year</span>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4 animate-slideUp flex-shrink-0" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <div className="absolute -top-1.5 -left-1.5 text-2xl text-indigo-500/20">"</div>
            <p className="text-gray-400 text-xs leading-relaxed bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-gray-700/50 rounded-xl p-3.5 min-h-[85px] transition-all hover:border-indigo-500/30 hover:bg-gray-800/70 hover:shadow-lg hover:shadow-indigo-500/5 relative z-10">
              {userData.bio || 'No bio yet'}
            </p>
            <div className="absolute -bottom-1.5 -right-1.5 text-2xl text-indigo-500/20 rotate-180">"</div>
          </div>
        </div>

        {/* Followers & Following Stats */}
        <div className="flex justify-center gap-6 mb-4 py-3 border-y border-gray-800/50 animate-slideUp flex-shrink-0" style={{ animationDelay: '0.15s' }}>
          <div className="text-center group/stat cursor-pointer transition-all hover:scale-110">
            <div className="relative">
              <p className="text-gray-400 text-[10px] mb-1.5 font-semibold uppercase tracking-wider">Followers</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent group-hover/stat:scale-110 transition-transform">
                0
              </p>
              {/* Decorative underline */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-indigo-500 group-hover/stat:w-full transition-all duration-300"></div>
            </div>
          </div>
          <div className="w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent"></div>
          <div className="text-center group/stat cursor-pointer transition-all hover:scale-110">
            <div className="relative">
              <p className="text-gray-400 text-[10px] mb-1.5 font-semibold uppercase tracking-wider">Following</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent group-hover/stat:scale-110 transition-transform">
                0
              </p>
              {/* Decorative underline */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-indigo-500 group-hover/stat:w-full transition-all duration-300"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 animate-slideUp flex-shrink-0" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={onManageFollowers}
            className="flex-1 relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-bold py-3 px-3 rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 group/btn"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Manage Followers
            </span>
          </button>
        </div>
      </div>
      
      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
});

ProfileCard.displayName = 'ProfileCard';


export default ProfileCard;