import React from 'react';
import { ThreeDotsVerticalIcon, StarOutlineIcon, StarSolidIcon, ArchiveIcon, TrashIcon } from '../../icons';

export default function FileNoteCard({ note, onOpen, onMenu, openMenuId, onMenuToggle, onToggleFavourite, onArchive, onDelete }) {
  const { id, title, notePreviewImageUrl, createdAt, tags, isFavourite, type } = note || {};
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString(undefined,{ month:'short', day:'numeric', year:'numeric'}) : '';
  
  // Get the first tag for the badge
  const firstTag = Array.isArray(tags) && tags.length > 0 ? tags[0] : null;

  return (
    <div
      className={`bg-[#1a1a1a] border ${isFavourite ? 'border-yellow-400/50' : 'border-gray-800'} hover:border-gray-700 rounded-xl overflow-hidden transition-all hover:shadow-xl h-[240px] w-full flex flex-col relative`}
      onClick={() => onOpen && onOpen(note)}
    >
      {/* Preview Image with overlay tag and menu */}
      <div className="relative h-40 w-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
        {notePreviewImageUrl ? (
          <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${notePreviewImageUrl})` }} />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        )}
        
        {/* Tag badge overlay */}
        {firstTag && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded-full">
              {firstTag.name || firstTag}
            </span>
          </div>
        )}
        
        {/* Three-dot menu */}
        <div className="absolute top-3 right-3 card-options-menu z-20">
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              onMenuToggle && onMenuToggle(id); 
            }}
            className="p-1.5 bg-black/30 hover:bg-black/50 rounded-md text-white/80"
            title="Options"
          >
            <ThreeDotsVerticalIcon className="w-4 h-4" />
          </button>
          {openMenuId === id && (
            <div className="absolute right-0 mt-2 w-40 bg-[#111] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onToggleFavourite && onToggleFavourite(id); 
                }}
                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-800 flex items-center gap-2"
              >
                {isFavourite ? <StarSolidIcon className="w-4 h-4 text-yellow-400" /> : <StarOutlineIcon className="w-4 h-4 text-yellow-400" />}
                {isFavourite ? 'Remove Favourite' : 'Add to Favourites'}
              </button>
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onArchive && onArchive(id); 
                }}
                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-800 flex items-center gap-2"
              >
                <ArchiveIcon className="w-4 h-4" />
                Archive
              </button>
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onDelete && onDelete(id); 
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2"
              >
                <TrashIcon className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom content */}
      <div className="p-4 flex-1 flex flex-col bg-[#1a1a1a]">
        <h3 className="text-white font-bold text-base mb-1 truncate">
          {title || 'Untitled'}
        </h3>
        <div className="text-xs text-gray-400">
          created on {formattedDate}
        </div>
      </div>
    </div>
  );
}
