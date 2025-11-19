import React from 'react';
import { ThreeDotsVerticalIcon, StarOutlineIcon, StarSolidIcon, ArchiveIcon, TrashIcon, CalendarIcon } from './icons';

const NoteCard = ({ note, openMenuId, onMenuToggle, onToggleFavourite, onArchive, onDelete }) => {
  return (
    <div className={`bg-[#1a1a1a] border ${note.isFavourite ? 'border-yellow-400/50' : 'border-gray-800'} hover:border-gray-700 rounded-xl overflow-hidden transition-all hover:shadow-xl h-[240px] w-full flex flex-col`}>
      <div className="relative">
        {/* Note card menu */}
        <div className="absolute top-2 right-2 card-options-menu z-20">
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              onMenuToggle(note.id); 
            }}
            className="p-1.5 bg-black/30 hover:bg-black/50 rounded-md text-white/80"
            title="Options"
          >
            <ThreeDotsVerticalIcon className="w-4 h-4" />
          </button>
          {openMenuId === note.id && (
            <div className="absolute right-0 mt-2 w-40 bg-[#111] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onToggleFavourite(note.id); 
                }}
                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-800 flex items-center gap-2"
              >
                {note.isFavourite ? <StarSolidIcon className="w-4 h-4 text-yellow-400" /> : <StarOutlineIcon className="w-4 h-4 text-yellow-400" />}
                {note.isFavourite ? 'Remove Favourite' : 'Add to Favourites'}
              </button>
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onArchive(note.id); 
                }}
                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-800 flex items-center gap-2"
              >
                <ArchiveIcon className="w-4 h-4" />
                {note.archivedAt ? 'Unarchive' : 'Archive'}
              </button>
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onDelete(note.id); 
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
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-white font-bold text-sm mb-2 truncate flex items-center gap-1">
          {note.title}
          {note.isFavourite && <StarSolidIcon className="w-3 h-3 text-yellow-400" />}
        </h3>
        <div className="text-[11px] text-gray-400 mb-2 flex items-center gap-1">
          <CalendarIcon className="w-3 h-3 text-indigo-400" />
          <span>{new Date(note.createdAt).toLocaleDateString(undefined,{ month:'short', day:'numeric', year:'numeric'})}</span>
        </div>
        <div className="text-xs text-gray-500 line-clamp-5 overflow-hidden" dangerouslySetInnerHTML={{ __html: note.content }} />
      </div>
    </div>
  );
};

export default NoteCard;
