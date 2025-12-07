import React from 'react';

// ===== PUBLIC PROFILE CARD (LEFT SIDEBAR) =====

export const PublicProfileCard = ({ 
  userData, 
  isFollowing, 
  onFollow
}) => {
  return (
    <div className="relative bg-[#161A2B] border border-indigo-900/40 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-950/30 transition-all hover:shadow-indigo-500/40 hover:border-indigo-500/60 group/profilecard h-full flex flex-col sticky top-4">
      {/* Shimmer effect - plays once on mount */}
      <div className="absolute inset-0 pointer-events-none z-10 animate-sweepOnce" style={{animationFillMode: 'forwards'}}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </div>
      
      {/* Profile Banner with Avatar */}
      <div className="relative h-24 overflow-visible flex-shrink-0">
        {userData?.coverImage || userData?.coverImageUrl ? (
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={userData.coverImage || userData.coverImageUrl} 
              alt="cover" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover/profilecard:scale-110" 
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
        
        {/* Diagonal white sweep - plays once on mount */}
        <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-br from-white/40 via-white/20 to-transparent transform skew-x-[-20deg] translate-x-12 animate-sweepOnce"></div>
        
        {/* Decorative corner accent */}
        <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-white/20 rounded-tr-2xl"></div>
        
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full p-1 overflow-hidden ring-4 ring-gray-800 shadow-2xl transition-all duration-300 group-hover/profilecard:ring-indigo-500 group-hover/profilecard:ring-6 group-hover/profilecard:scale-110 group-hover/profilecard:shadow-indigo-500/50">
              {userData?.profilePic || userData?.profileImageUrl ? (
                <img src={userData.profilePic || userData.profileImageUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center relative overflow-hidden">
                  <svg className="w-8 h-8 text-white relative" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
            </div>
            {userData.isOnline && (
              <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#161A2B] shadow-lg shadow-green-500/50">
                <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-10 px-4 pb-4 flex flex-col flex-1">
        {/* User Info */}
        <div className="text-center mb-3 flex-shrink-0">
          <h2 className="text-lg font-bold text-white mb-1 tracking-tight group-hover/profilecard:text-indigo-400 transition-all duration-300">
            {userData.name}
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-1">
            <svg className="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="leading-relaxed">{userData.school || 'CIT University'}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-xs text-indigo-300">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
            <span className="font-medium">{userData.program || 'Computer Science'}</span>
            {userData.yearLevel && (
              <span className="text-indigo-400">• {userData.yearLevel}{userData.yearLevel === 1 ? 'st' : userData.yearLevel === 2 ? 'nd' : userData.yearLevel === 3 ? 'rd' : 'th'} Year</span>
            )}
          </div>
          
          {/* Mentor Badge */}
          {userData.isMentor && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs text-amber-300 mt-1.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">Mentor</span>
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="mb-3 animate-slideUp flex-shrink-0" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <div className="absolute -top-1.5 -left-1.5 text-2xl text-indigo-500/20">"</div>
            <p className="text-gray-400 text-xs leading-relaxed bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-gray-700/50 rounded-xl p-2.5 min-h-[70px] transition-all hover:border-indigo-500/30 hover:bg-gray-800/70 hover:shadow-lg hover:shadow-indigo-500/5 relative z-10">
              {userData.bio || 'No bio yet'}
            </p>
            <div className="absolute -bottom-1.5 -right-1.5 text-2xl text-indigo-500/20 rotate-180">"</div>
          </div>
        </div>

        {/* Social Proof Stats - Prominent Display */}
        <div className="flex justify-center gap-6 mb-3 py-2.5 border-y border-gray-800/50 animate-slideUp flex-shrink-0" style={{ animationDelay: '0.15s' }}>
          <div className="text-center group/stat transition-all hover:scale-110">
            <div className="relative">
              <p className="text-gray-400 text-[10px] mb-1 font-semibold uppercase tracking-wider">Followers</p>
              <p className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent group-hover/stat:scale-110 transition-transform">
                {userData.followersCount || 0}
              </p>
              {/* Decorative underline */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-indigo-500 group-hover/stat:w-full transition-all duration-300"></div>
            </div>
          </div>
          <div className="w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent"></div>
          <div className="text-center group/stat transition-all hover:scale-110">
            <div className="relative">
              <p className="text-gray-400 text-[10px] mb-1 font-semibold uppercase tracking-wider">Following</p>
              <p className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent group-hover/stat:scale-110 transition-transform">
                {userData.followingCount || 0}
              </p>
              {/* Decorative underline */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-indigo-500 group-hover/stat:w-full transition-all duration-300"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 animate-slideUp flex-shrink-0" style={{ animationDelay: '0.25s' }}>
          {/* Primary Action: Follow Button */}
          <button
            onClick={onFollow}
            className={`w-full relative overflow-hidden text-sm font-bold py-2.5 px-3 rounded-xl transition-all shadow-lg group/btn ${
              isFollowing
                ? 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600 shadow-gray-900/50'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isFollowing ? (
                <>
                  <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Following
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Follow
                </>
              )}
            </span>
          </button>
        </div>
      </div>
      
      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-indigo-500 opacity-0 group-hover/profilecard:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

export default PublicProfileCard;
