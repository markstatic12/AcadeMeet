import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeDotsVerticalIcon, HistoryIcon, TrashIcon, BookmarkCheckIcon, ArchiveIcon, PlusIcon } from '../../icons';



// ===== TAB BUTTONS =====

export const TabButtons = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTabChange('sessions');
        }}
        className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all ${
          activeTab === 'sessions'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
      >
        Sessions
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTabChange('notes');
        }}
        className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all ${
          activeTab === 'notes'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
      >
        Notes
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
        className="p-3 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl transition-colors"
      >
        <ThreeDotsVerticalIcon className="w-5 h-5" />
      </button>
      {showMenu && (
        activeTab === 'sessions' ? (
          <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            <button
              onClick={() => {
                // Handle history (placeholder)
                onToggle();
              }}
              className="w-full px-4 py-3 text-left text-sm text-white hover:bg-gray-800 transition-colors flex items-center gap-3"
            >
              <HistoryIcon className="w-4 h-4" />
              History
            </button>
            <button
              onClick={onTrashClick}
              className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-gray-800 transition-colors flex items-center gap-3"
            >
              <TrashIcon className="w-4 h-4" />
              Trash
            </button>
          </div>
        ) : (
          <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            <button
              onClick={onFavouritesClick}
              className="w-full px-5 py-3 text-left text-sm text-white hover:bg-gray-800 transition-colors flex items-center gap-3"
            >
              <BookmarkCheckIcon className="w-4 h-4 text-indigo-400" />
              Favourite Notes
            </button>
            <div className="h-px w-full bg-gray-700" />
            <button
              onClick={onArchivedClick}
              className="w-full px-5 py-3 text-left text-sm text-white hover:bg-gray-800 transition-colors flex items-center gap-3"
            >
              <ArchiveIcon className="w-4 h-4 text-white" />
              Archived Notes
            </button>
            <div className="h-px w-full bg-gray-700" />
            <button
              onClick={onTrashedClick}
              className="w-full px-5 py-3 text-left text-sm text-red-400 hover:bg-gray-800 transition-colors flex items-center gap-3"
            >
              <TrashIcon className="w-4 h-4" />
              Trashed Notes
            </button>
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
      className="bg-[#1a1a1a] border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center transition-all group hover:bg-[#1f1f1f] h-[240px] w-full"
    >
      <div className="w-16 h-16 bg-[#2a2a2a] group-hover:bg-indigo-600/20 rounded-full flex items-center justify-center mb-3 transition-colors">
        <PlusIcon className="w-8 h-8 text-gray-600 group-hover:text-indigo-400" />
      </div>
      <p className="text-gray-500 group-hover:text-gray-400 text-xs font-light italic">{label}</p>
    </button>
  );
};


export default TabButtons;