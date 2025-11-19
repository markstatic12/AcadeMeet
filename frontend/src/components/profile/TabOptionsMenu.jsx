import React from 'react';
import { ThreeDotsVerticalIcon, HistoryIcon, TrashIcon, BookmarkCheckIcon, ArchiveIcon } from './icons';

const TabOptionsMenu = ({ 
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

export default TabOptionsMenu;
