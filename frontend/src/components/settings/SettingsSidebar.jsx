import React from 'react';
import { UserIcon, ShieldIcon, LogoutIcon } from '../../icons/icons';

const SettingsSidebar = ({ active, onTabChange, onLogoutClick }) => {
  return (
    <div className="w-72">
      <h2 className="text-3xl font-bold text-white mb-6">Settings</h2>
      <div className="space-y-3">
        <button
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border ${
            active === 'profile'
              ? 'bg-gray-800/70 border-indigo-600 text-white'
              : 'bg-[#1f1f1f] border-gray-800 text-gray-300 hover:bg-gray-800/60'
          }`}
          onClick={() => onTabChange('profile')}
        >
          <UserIcon className="w-4 h-4" />
          <span className="text-sm">Public Profile</span>
        </button>
        
        <button
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border ${
            active === 'password'
              ? 'bg-gray-800/70 border-indigo-600 text-white'
              : 'bg-[#1f1f1f] border-gray-800 text-gray-300 hover:bg-gray-800/60'
          }`}
          onClick={() => onTabChange('password')}
        >
          <ShieldIcon className="w-4 h-4" />
          <span className="text-sm">Password Reset</span>
        </button>
        
        <button
          onClick={onLogoutClick}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1f1f1f] border border-gray-800 text-red-400 hover:bg-gray-800/60"
        >
          <LogoutIcon className="w-4 h-4" />
          <span className="text-sm">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsSidebar;
