import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeDotsVerticalIcon, HistoryIcon, TrashIcon, BookmarkCheckIcon, ArchiveIcon, PlusIcon } from '../../icons';



// ===== TAB BUTTONS =====

export const TabButtons = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-3">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTabChange('sessions');
        }}
        className={`relative overflow-hidden px-8 py-3 rounded-xl font-bold text-base transition-all group/tab ${
          activeTab === 'sessions'
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-500/50 scale-105 border-2 border-indigo-500/50'
            : 'text-gray-400 hover:text-white bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-gray-800 hover:to-gray-900 border-2 border-gray-700 hover:border-gray-600'
        }`}
      >
        {activeTab === 'sessions' && (
          <>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></span>
            <div className="absolute inset-0 bg-indigo-600/20 animate-pulse"></div>
          </>
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <svg className={`w-4 h-4 transition-transform ${activeTab === 'sessions' ? 'rotate-12' : 'group-hover/tab:rotate-12'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          Sessions
        </span>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTabChange('notes');
        }}
        className={`relative overflow-hidden px-8 py-3 rounded-xl font-bold text-base transition-all group/tab ${
          activeTab === 'notes'
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-500/50 scale-105 border-2 border-indigo-500/50'
            : 'text-gray-400 hover:text-white bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-gray-800 hover:to-gray-900 border-2 border-gray-700 hover:border-gray-600'
        }`}
      >
        {activeTab === 'notes' && (
          <>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></span>
            <div className="absolute inset-0 bg-indigo-600/20 animate-pulse"></div>
          </>
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <svg className={`w-4 h-4 transition-transform ${activeTab === 'notes' ? 'rotate-12' : 'group-hover/tab:rotate-12'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
            <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
          Notes
        </span>
      </button>
    </div>
  );
};


// ===== TAB OPTIONS MENU =====

export const TabOptionMenu = ({ 
  showMenu, 
  activeTab, 
  onToggle, 
  onTrashClick, 
  onFavouritesClick, 
  onArchivedClick, 
  onTrashedClick 
}) => {
  return (
    <div className="relative tab-options-menu">
      <button
        onClick={onToggle}
        className="relative overflow-hidden p-3.5 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-400 hover:text-white rounded-xl transition-all hover:scale-110 hover:shadow-xl border border-gray-700 hover:border-gray-600 group/btn"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
        <ThreeDotsVerticalIcon className="w-5 h-5 relative z-10 group-hover/btn:rotate-90 transition-transform" />
      </button>
      {showMenu && (
        activeTab === 'sessions' ? (
          <div className="absolute right-0 mt-3 w-52 bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl shadow-2xl shadow-indigo-500/20 z-50 overflow-hidden animate-slideDown backdrop-blur-xl">
            <div className="p-1">
              <button
                onClick={() => {
                  // Handle history (placeholder)
                  onToggle();
                }}
                className="w-full px-4 py-3.5 text-left text-sm text-white hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 transition-all flex items-center gap-3 group rounded-xl"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <HistoryIcon className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="font-bold">History</span>
              </button>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-1"></div>
              <button
                onClick={onTrashClick}
                className="w-full px-4 py-3.5 text-left text-sm text-red-400 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-700/20 transition-all flex items-center gap-3 group rounded-xl"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center border border-red-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <TrashIcon className="w-4 h-4 text-red-400" />
                </div>
                <span className="font-bold">Trash</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="absolute right-0 mt-3 w-60 bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl shadow-2xl shadow-indigo-500/20 z-50 overflow-hidden animate-slideDown backdrop-blur-xl">
            <div className="p-1">
              <button
                onClick={onFavouritesClick}
                className="w-full px-4 py-3.5 text-left text-sm text-white hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 transition-all flex items-center gap-3 group rounded-xl"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center border border-yellow-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all">
                  <BookmarkCheckIcon className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="font-bold">Favourite Notes</span>
              </button>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-1" />
              <button
                onClick={onArchivedClick}
                className="w-full px-4 py-3.5 text-left text-sm text-white hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 transition-all flex items-center gap-3 group rounded-xl"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-600/20 to-gray-700/20 flex items-center justify-center border border-gray-600/30 group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <ArchiveIcon className="w-4 h-4 text-gray-400" />
                </div>
                <span className="font-bold">Archived Notes</span>
              </button>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-1" />
              <button
                onClick={onTrashedClick}
                className="w-full px-4 py-3.5 text-left text-sm text-red-400 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-700/20 transition-all flex items-center gap-3 group rounded-xl"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center border border-red-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <TrashIcon className="w-4 h-4 text-red-400" />
                </div>
                <span className="font-bold">Trashed Notes</span>
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

// ===== CREATE NEW CARD =====

export const CreateNewCard = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="relative bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-2xl flex flex-col items-center justify-center transition-all group hover:shadow-xl hover:shadow-indigo-500/20 h-[180px] w-full overflow-hidden"
    >
      {/* Decorative background gradient */}
      <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-all duration-700"></div>
      
      {/* Decorative orbs */}
      <div className="absolute top-4 left-4 w-20 h-20 bg-indigo-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-4 right-4 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      

      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-800/80 to-gray-900/80 group-hover:from-indigo-600/30 group-hover:to-indigo-700/30 rounded-lg flex items-center justify-center mb-2.5 transition-all shadow-xl group-hover:shadow-indigo-500/40 group-hover:scale-110 border border-gray-700 group-hover:border-indigo-500/50">
          <PlusIcon className="w-6 h-6 text-gray-600 group-hover:text-indigo-400 transition-all group-hover:rotate-180" />
        </div>
        <p className="text-gray-500 group-hover:text-gray-300 text-[11px] font-bold max-w-[160px] text-center leading-relaxed transition-colors">
          {label}
        </p>
      </div>
    </button>
  );
};


export default TabButtons;