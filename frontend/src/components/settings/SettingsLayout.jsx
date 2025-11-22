import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackIcon, UserIcon, ShieldIcon, LogoutIcon, WarningIcon } from '../../icons';

// ===== SETTINGS HEADER =====

export const SettingsHeader = ({ onBack }) => {
  return (
    <div className="flex gap-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-indigo-300 hover:text-white mb-4"
      >
        <BackIcon className="w-7 h-7 p-1.5 rounded-full bg-indigo-600/80" />
        <span className="text-lg">Back</span>
      </button>
    </div>
  );
};

// ===== SETTINGS SIDEBAR =====

export const SettingsSidebar = ({ active, onTabChange, onLogoutClick }) => {
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

// ===== LOGOUT MODAL =====

export const LogoutModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-600/20 text-red-300 flex items-center justify-center border border-red-500/30">
            <WarningIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white">Log out?</h4>
            <p className="text-sm text-gray-400 mt-1">
              You'll need to sign in again to access your account.
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};


// ===== TOAST =====

export const Toast = ({ toast }) => {
  if (!toast) return null;

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-600/20 border-green-500 text-green-200';
      case 'error':
        return 'bg-red-600/20 border-red-500 text-red-200';
      default:
        return 'bg-gray-700/80 border-gray-600 text-gray-100';
    }
  };

  return (
    <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-lg shadow-lg border text-sm ${getToastStyles()}`}>
      {toast.message}
    </div>
  );
};

export default SettingsHeader;