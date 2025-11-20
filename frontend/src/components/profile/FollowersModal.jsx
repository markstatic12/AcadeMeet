import React from 'react';
import { CloseIcon } from '../../icons';

const FollowersModal = ({ 
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

export default FollowersModal;
