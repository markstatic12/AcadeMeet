import React from 'react';
import { UserIcon, LogoutIcon, WarningIcon, SettingsIcon, UsersIcon } from '../../icons';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Divider } from '../ui/Divider';

// ===== SETTINGS SIDEBAR =====

export const SettingsSidebar = ({ onLogoutClick }) => {
  return (
    <div className="w-64 space-y-4">
      {/* Header */}
      <div className="animate-slideInLeft" style={{ animationDelay: '0s' }}>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center group/icon hover:scale-110 hover:rotate-6 transition-all duration-300 cursor-pointer hover:bg-indigo-600/30 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/30">
            <SettingsIcon className="w-4 h-4 text-indigo-400 group-hover/icon:rotate-180 transition-transform duration-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <p className="text-xs text-gray-400">Manage your account</p>
          </div>
        </div>
      </div>

      {/* Navigation Card */}
      <div className="animate-slideInLeft" style={{ animationDelay: '0.05s' }}>
        <Card variant="elevated" padding="sm" className="relative overflow-hidden group/navcard">
        {/* Shimmer effect for card */}
        <div className="absolute inset-0 opacity-0 group-hover/navcard:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/navcard:translate-x-full transition-transform duration-1000 ease-out"></div>
        </div>
        <div className="space-y-1 p-2 relative z-10">
          {/* Active: Public Profile */}
          <div className="relative group/profile cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-lg blur-sm group-hover/profile:blur-md transition-all" />
            <div className="relative w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20 overflow-hidden group-hover/profile:shadow-indigo-500/40 group-hover/profile:scale-[1.02] transition-all">
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover/profile:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/profile:translate-x-full transition-transform duration-1000 ease-out"></div>
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <UserIcon className="w-5 h-5 group-hover/profile:scale-110 transition-transform duration-300" />
                <span className="font-medium">Public Profile</span>
              </div>
              <Badge variant="success" size="sm" className="relative z-10">Active</Badge>
            </div>
          </div>
          
          {/* Divider */}
          <div className="py-2">
            <Divider />
          </div>
          
          {/* Logout Button */}
          <button
            onClick={onLogoutClick}
            className="relative w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-red-600/20 border border-gray-700/50 hover:border-red-500/30 text-gray-300 hover:text-red-400 transition-all duration-200 group overflow-hidden hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20"
          >
            {/* Hover background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-3 relative z-10">
              <LogoutIcon className="w-5 h-5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium">Log Out</span>
            </div>
            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </Card>
      </div>

      {/* Developers */}
      <div className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
        <Card variant="solid" padding="sm" className="relative overflow-hidden group/devcard">
        {/* Shimmer effect for card */}
        <div className="absolute inset-0 opacity-0 group-hover/devcard:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/devcard:translate-x-full transition-transform duration-1000 ease-out"></div>
        </div>
        {/* Header */}
        <div className="flex items-center gap-2 pb-2 border-b border-gray-800 relative z-10">
          <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h4 className="text-xs font-bold text-white">Developers</h4>
        </div>
        
        {/* Members List */}
        <div className="mt-2.5 space-y-2 relative z-10">
          {/* Lead Developer */}
          <div className="flex items-center gap-2 p-1.5 rounded-md bg-gradient-to-r from-blue-500/10 to-transparent border-l border-blue-500 hover:from-blue-500/15 transition-all duration-200 hover:shadow-md hover:shadow-blue-500/20 hover:scale-[1.02] relative overflow-hidden group/dev">
            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover/dev:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent -translate-x-full group-hover/dev:translate-x-full transition-transform duration-700 ease-out"></div>
            </div>
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-[8px] shadow-sm relative z-10">
              ZA
            </div>
            <div className="flex-1 min-w-0 relative z-10">
              <div className="flex items-center gap-1">
                <p className="text-[11px] font-bold text-blue-400 truncate">Zander Aligato</p>
                <svg className="w-2.5 h-2.5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-[8px] text-gray-400 font-medium uppercase tracking-wide">Lead Developer</p>
            </div>
          </div>
          
          {/* Backend Developer */}
          <div className="flex items-center gap-2 p-1.5 rounded-md bg-gradient-to-r from-purple-500/10 to-transparent border-l border-purple-500 hover:from-purple-500/15 transition-all duration-200 hover:shadow-md hover:shadow-purple-500/20 hover:scale-[1.02] relative overflow-hidden group/dev">
            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover/dev:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent -translate-x-full group-hover/dev:translate-x-full transition-transform duration-700 ease-out"></div>
            </div>
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-[8px] shadow-sm relative z-10">
              RB
            </div>
            <div className="flex-1 min-w-0 relative z-10">
              <div className="flex items-center gap-1">
                <p className="text-[11px] font-bold text-purple-400 truncate">Richemmae Bigno</p>
                <svg className="w-2.5 h-2.5 text-purple-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-[8px] text-gray-400 font-medium uppercase tracking-wide">Backend Developer</p>
            </div>
          </div>
          
          {/* Frontend Developer */}
          <div className="flex items-center gap-2 p-1.5 rounded-md bg-gradient-to-r from-indigo-500/10 to-transparent border-l border-indigo-500 hover:from-indigo-500/15 transition-all duration-200 hover:shadow-md hover:shadow-indigo-500/20 hover:scale-[1.02] relative overflow-hidden group/dev">
            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover/dev:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent -translate-x-full group-hover/dev:translate-x-full transition-transform duration-700 ease-out"></div>
            </div>
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[8px] shadow-sm relative z-10">
              MC
            </div>
            <div className="flex-1 min-w-0 relative z-10">
              <div className="flex items-center gap-1">
                <p className="text-[11px] font-bold text-indigo-400 truncate">Mark Anton Camoro</p>
                <svg className="w-2.5 h-2.5 text-indigo-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-[8px] text-gray-400 font-medium uppercase tracking-wide">Frontend Developer</p>
            </div>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
};

// ===== LOGOUT MODAL =====

export const LogoutModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-3xl w-full max-w-md p-8 shadow-2xl animate-scaleIn">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center border-2 border-red-500/30 shadow-lg shadow-red-500/20">
              <WarningIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="text-center mb-8">
          <h4 className="text-2xl font-bold text-white mb-2">Log out of your account?</h4>
          <p className="text-sm text-gray-400">
            You'll need to sign in again to access your account and continue using AcadeMeet.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-all duration-200 font-medium hover:scale-105 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/30 transition-all duration-200 font-medium hover:scale-105 active:scale-95"
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

  const getToastConfig = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-600 to-emerald-600',
          border: 'border-green-500/30',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ),
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-600 to-rose-600',
          border: 'border-red-500/30',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ),
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-700 to-gray-800',
          border: 'border-gray-600/30',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          ),
        };
    }
  };

  const config = getToastConfig();

  return (
    <div className="fixed top-6 right-6 z-50 animate-slideInRight">
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl ${config.bg} border ${config.border} text-white shadow-2xl backdrop-blur-sm min-w-[300px]`}>
        <div className="flex-shrink-0">
          {config.icon}
        </div>
        <p className="font-medium flex-1">{toast.message}</p>
      </div>
    </div>
  );
};