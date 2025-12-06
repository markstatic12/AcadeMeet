import React, { useState, useRef } from 'react';
import { ThreeDotsVerticalIcon, StarOutlineIcon, StarSolidIcon, ArchiveIcon, TrashIcon, CalendarIcon } from '../../icons';
import FileNoteCard from '../notes/FileNoteCard';
import UploadNoteModal from '../notes/UploadNoteModal';
import { CreateNewCard } from './ProfileNavigation';
import { noteService } from '../../services/noteService';
import { useUser } from '../../context/UserContext';


// ===== NOTE CARD =====

export const NoteCard = ({ note, openMenuId, onMenuToggle, onToggleFavourite, onArchive, onDelete }) => {
  return (
    <div className={`relative bg-gradient-to-b from-gray-900 to-gray-800 border ${note.isFavourite ? 'border-yellow-400/60 shadow-lg shadow-yellow-500/20' : 'border-gray-700/50'} rounded-2xl overflow-hidden transition-all hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/20 h-[180px] w-full flex flex-col group hover:scale-[1.02]`}>
      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-all duration-700 pointer-events-none"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 left-4 w-16 h-16 bg-indigo-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-4 right-4 w-20 h-20 bg-indigo-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      

      
      {/* Gradient accent line top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent group-hover:via-indigo-500 transition-all duration-300"></div>
      
      <div className="relative z-10">
        {/* Note card menu */}
        <div className="absolute top-3 right-3 card-options-menu z-20">
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              onMenuToggle(note.id); 
            }}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white/90 hover:text-white backdrop-blur-md transition-all hover:scale-110 border border-white/10 hover:border-white/20 shadow-lg"
            title="Options"
          >
            <ThreeDotsVerticalIcon className="w-4 h-4" />
          </button>
          {openMenuId === note.id && (
            <div className="absolute right-0 mt-2 w-44 bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden animate-slideDown backdrop-blur-xl">
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onToggleFavourite(note.id); 
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 flex items-center gap-2.5 transition-all group/item"
              >
                {note.isFavourite ? <StarSolidIcon className="w-4 h-4 text-yellow-400 group-hover/item:scale-125 group-hover/item:rotate-12 transition-all" /> : <StarOutlineIcon className="w-4 h-4 text-yellow-400 group-hover/item:scale-125 group-hover/item:rotate-12 transition-all" />}
                <span className="font-medium">{note.isFavourite ? 'Remove Favourite' : 'Add to Favourites'}</span>
              </button>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onArchive(note.id); 
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 flex items-center gap-2.5 transition-all group/item"
              >
                <ArchiveIcon className="w-4 h-4 group-hover/item:scale-125 transition-all" />
                <span className="font-medium">{note.archivedAt ? 'Unarchive' : 'Archive'}</span>
              </button>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onDelete(note.id); 
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/20 flex items-center gap-2.5 transition-all group/item"
              >
                <TrashIcon className="w-4 h-4 group-hover/item:scale-125 group-hover/item:rotate-12 transition-all" />
                <span className="font-medium">Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="relative z-10 p-4 flex-1 flex flex-col">
        {/* Icon container */}
        <div className="mb-2 flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          {note.isFavourite && (
            <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/40 backdrop-blur-sm">
              <StarSolidIcon className="w-3 h-3 text-yellow-400 animate-pulse" />
            </div>
          )}
        </div>
        
        <h3 className="text-white font-bold text-sm mb-2 truncate group-hover:text-indigo-400 transition-all tracking-tight">
          {note.title}
        </h3>
        
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-1 text-[10px] text-gray-400 group-hover:text-indigo-300 transition-colors">
            <div className="w-5 h-5 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
              <CalendarIcon className="w-2.5 h-2.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-medium">{new Date(note.createdAt).toLocaleDateString(undefined,{ month:'short', day:'numeric', year:'numeric'})}</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 line-clamp-4 overflow-hidden group-hover:text-gray-400 transition-colors leading-relaxed" dangerouslySetInnerHTML={{ __html: note.content }} />
      </div>
      
      {/* Gradient accent line bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent group-hover:via-indigo-500 transition-all duration-300"></div>
    </div>
  );
};


// ===== FAVOURITE NOTE CARD =====

export const FavouriteNoteCard = ({ note }) => {
  return (
    <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#151515] border border-yellow-400/60 rounded-2xl overflow-hidden h-[180px] w-full flex flex-col shadow-xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all hover:scale-[1.02] group">
      {/* Golden glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-amber-500/10 to-orange-500/10 group-hover:from-yellow-500/15 group-hover:via-amber-500/15 group-hover:to-orange-500/15 transition-all duration-700"></div>
      
      {/* Decorative stars */}
      <div className="absolute top-3 left-3 w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-3 right-3 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      

      
      {/* Top golden accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-yellow-500/50 via-amber-500 to-yellow-500/50 group-hover:h-[3px] transition-all duration-300"></div>
      
      <div className="relative z-10 p-4 flex-1 flex flex-col">
        {/* Icon container with star */}
        <div className="mb-2 flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500/30 to-amber-500/30 flex items-center justify-center border-2 border-yellow-400/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-yellow-500/30">
            <StarSolidIcon className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
          <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/50 backdrop-blur-sm">
            <span className="text-[9px] font-bold text-yellow-300 tracking-wide">FAVOURITE</span>
          </div>
        </div>
        
        <h3 className="text-white font-bold text-sm mb-2 truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-amber-400 transition-all tracking-tight">
          {note.title}
        </h3>
        
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-1 text-[10px] text-gray-400 group-hover:text-yellow-300 transition-colors">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center border border-yellow-400/40">
              <CalendarIcon className="w-2.5 h-2.5 text-yellow-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-medium">{new Date(note.createdAt).toLocaleDateString(undefined,{ month:'short', day:'numeric', year:'numeric'})}</span>
          </div>
        </div>
        
        <div className="text-[11px] text-gray-500 line-clamp-3 overflow-hidden group-hover:text-gray-400 transition-colors leading-relaxed" dangerouslySetInnerHTML={{ __html: note.content }} />
      </div>
      
      {/* Bottom golden accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-yellow-500/50 via-amber-500 to-yellow-500/50 group-hover:h-[3px] transition-all duration-300"></div>
    </div>
  );
};


// ===== ARCHIVED NOTE CARD =====

export const ArchivedNoteCard = ({ note, onRestore }) => {
  return (
    <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl overflow-hidden h-[180px] w-full flex flex-col hover:border-gray-700 hover:shadow-lg transition-all group">
      {/* Muted decorative elements */}
      <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-gray-600/10 to-gray-700/10 rounded-full blur-2xl"></div>
      
      {/* Archive badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-600/40 backdrop-blur-sm flex items-center gap-1.5">
          <ArchiveIcon className="w-3 h-3 text-gray-400" />
          <span className="text-[10px] font-bold text-gray-400 tracking-wide">ARCHIVED</span>
        </div>
      </div>
      
      {/* Restore button */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
        <button
          onClick={() => onRestore(note.id)}
          className="px-3 py-2 text-xs rounded-lg bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-300 border border-green-500/40 hover:border-green-500/60 hover:from-green-600/30 hover:to-emerald-600/30 transition-all hover:scale-110 font-bold shadow-lg hover:shadow-green-500/30 backdrop-blur-sm"
        >
          ↻ Restore
        </button>
      </div>
      
      <div className="relative z-10 p-5 flex-1 flex flex-col opacity-75 hover:opacity-90 transition-opacity pt-14">
        {/* Icon container */}
        <div className="mb-3 flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600/20 to-gray-700/20 flex items-center justify-center border border-gray-600/30">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-white/80 font-bold text-base mb-3 truncate tracking-tight">{note.title}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-gray-600/20 to-gray-700/20 flex items-center justify-center border border-gray-600/30">
              <CalendarIcon className="w-3 h-3 text-gray-500" />
            </div>
            <span className="font-medium">{new Date(note.createdAt).toLocaleDateString(undefined,{ month:'short', day:'numeric', year:'numeric'})}</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-600 line-clamp-4 overflow-hidden leading-relaxed" dangerouslySetInnerHTML={{ __html: note.content }} />
      </div>
    </div>
  );
};


// ===== TRASHED NOTE CARD =====

export const TrashedNoteCard = ({ note, onRestore }) => {
  return (
    <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl overflow-hidden h-[180px] w-full flex flex-col hover:border-gray-700 hover:shadow-lg transition-all group">
      {/* Diagonal stripes pattern for deleted items */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)'
      }}></div>
      
      {/* Trash badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-500/40 backdrop-blur-sm flex items-center gap-1.5">
          <TrashIcon className="w-3 h-3 text-red-400" />
          <span className="text-[10px] font-bold text-red-400 tracking-wide">DELETED</span>
        </div>
      </div>
      
      {/* Restore button */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
        <button
          onClick={() => onRestore(note.id)}
          className="px-3 py-2 text-xs rounded-lg bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-300 border border-green-500/40 hover:border-green-500/60 hover:from-green-600/30 hover:to-emerald-600/30 transition-all hover:scale-110 font-bold shadow-lg hover:shadow-green-500/30 backdrop-blur-sm"
        >
          ↻ Restore
        </button>
      </div>
      
      <div className="relative z-10 p-5 flex-1 flex flex-col opacity-60 hover:opacity-75 transition-opacity pt-14">
        {/* Icon container - faded */}
        <div className="mb-3 flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700/20 to-gray-800/20 flex items-center justify-center border border-gray-700/30 opacity-50">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-white/60 font-bold text-base mb-3 truncate line-through tracking-tight">{note.title}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-gray-700/20 to-gray-800/20 flex items-center justify-center border border-gray-700/30">
              <CalendarIcon className="w-3 h-3 text-gray-600" />
            </div>
            <span className="font-medium">{new Date(note.createdAt).toLocaleDateString(undefined,{ month:'short', day:'numeric', year:'numeric'})}</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-600 line-clamp-4 overflow-hidden leading-relaxed" dangerouslySetInnerHTML={{ __html: note.content }} />
      </div>
    </div>
  );
};


// ===== NOTES CONTENT =====

export const NotesContent = ({ notesData, openNoteMenuId, onMenuToggle, onToggleFavourite, onArchive, onDelete }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    try {
      const types = e.dataTransfer?.types || [];
      if (Array.from(types).indexOf('Files') !== -1) {
        setIsDragActive(true);
      }
    } catch {
      setIsDragActive(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) setIsDragActive(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragActive(false);
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      try {
        await noteService.uploadFileNote(file, { title: file.name });
        // Reload page to show new note
        window.location.reload();
      } catch (err) {
        console.error('File upload failed', err);
        alert(`Failed to upload file: ${err.message}`);
      }
    }
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 relative"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragActive && (
        <div className="absolute inset-0 z-50 bg-indigo-600/10 border-4 border-dashed border-indigo-400 rounded-2xl flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-white text-xl font-bold">Drop files here to upload</p>
            <p className="text-gray-300 text-sm mt-2">Supported formats: PDF, images, documents</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        <CreateNewCard 
          onClick={() => setShowUploadModal(true)} 
          label="Upload Note File" 
        />
        {notesData
          .filter((n) => !n.archivedAt && !n.deletedAt)
          .map((note, index) => {
            // Check if this is a FILE type note by looking at the raw data
            const isFileNote = note.raw?.type === 'FILE' || note.type === 'FILE';
            
            if (isFileNote) {
              return (
                <div key={`note-${note.id}-${note.deletedAt || note.archivedAt || ''}`} className="animate-scaleIn" style={{ animationDelay: `${(index + 1) * 0.05}s` }}>
                  <FileNoteCard
                    note={{
                      ...note,
                      notePreviewImageUrl: note.raw?.notePreviewImageUrl || note.notePreviewImageUrl,
                      tags: note.raw?.tags || note.tags || [],
                      type: note.raw?.type || note.type
                    }}
                    openMenuId={openNoteMenuId}
                    onMenuToggle={onMenuToggle}
                    onToggleFavourite={onToggleFavourite}
                    onArchive={onArchive}
                    onDelete={onDelete}
                    onOpen={() => {
                      // Open file in new tab or download
                      const filePath = note.raw?.filePath || note.filePath;
                      if (filePath) {
                        window.open(`http://localhost:8080/${filePath}`, '_blank');
                      }
                    }}
                  />
                </div>
              );
            }
            
            return (
              <div key={`note-${note.id}-${note.deletedAt || note.archivedAt || ''}`} className="animate-scaleIn" style={{ animationDelay: `${(index + 1) * 0.05}s` }}>
                <NoteCard
                  note={note}
                  openMenuId={openNoteMenuId}
                  onMenuToggle={onMenuToggle}
                  onToggleFavourite={onToggleFavourite}
                  onArchive={onArchive}
                  onDelete={onDelete}
                />
              </div>
            );
          })}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadNoteModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          mode="profile"
        />
      )}
    </div>
  );
};



// ===== FAVOURITES CONTENT =====

export const FavouritesContent = ({ notesData, onBackToNotes }) => {
  const favouriteNotes = notesData.filter((n) => n.isFavourite && !n.archivedAt && !n.deletedAt);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
      <div className="mb-6 flex items-center justify-between animate-slideInLeft">
        <div className="text-white text-xl font-bold tracking-tight flex items-center gap-2">
          <StarSolidIcon className="w-5 h-5 text-yellow-400" />
          Favourite Notes
        </div>
        <button
          onClick={onBackToNotes}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-lg"
        >
          ← Back to Notes
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {favouriteNotes.length === 0 && (
          <div className="col-span-full bg-[#0a0a0a] border border-gray-700 rounded-xl p-12 text-center text-gray-400 animate-fadeIn">
            <div className="text-5xl mb-4 opacity-50">⭐</div>
            <p className="text-base">No favourite notes yet.</p>
            <p className="text-sm text-gray-500 mt-2">Star your important notes to find them here.</p>
          </div>
        )}
        {favouriteNotes.map((note, index) => (
          <div key={`note-${note.id}-${note.archivedAt || note.deletedAt || ''}`} className="animate-scaleIn" style={{ animationDelay: `${index * 0.05}s` }}>
            <FavouriteNoteCard note={note} />
          </div>
        ))}
      </div>
    </div>
  );
};


// ===== ARCHIVED CONTENT =====

export const ArchivedContent = ({ notesData, onBackToNotes, onRestore }) => {
  const archivedNotes = notesData.filter((n) => n.archivedAt && !n.deletedAt);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
      <div className="mb-6 flex items-center justify-between animate-slideInLeft">
        <div className="text-white text-xl font-bold tracking-tight flex items-center gap-2">
          <ArchiveIcon className="w-5 h-5 text-gray-300" />
          Archived Notes
        </div>
        <button
          onClick={onBackToNotes}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-lg"
        >
          ← Back to Notes
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {archivedNotes.length === 0 && (
          <div className="col-span-full bg-[#0a0a0a] border border-gray-700 rounded-xl p-12 text-center text-gray-400 animate-fadeIn">
            <div className="text-5xl mb-4 opacity-50">📦</div>
            <p className="text-base">No archived notes.</p>
            <p className="text-sm text-gray-500 mt-2">Archived notes will appear here.</p>
          </div>
        )}
        {archivedNotes.map((note, index) => (
          <div key={`note-${note.id}-${note.archivedAt || note.deletedAt || ''}`} className="animate-scaleIn" style={{ animationDelay: `${index * 0.05}s` }}>
            <ArchivedNoteCard note={note} onRestore={onRestore} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== TRASHED NOTES CONTENT =====

export const TrashedNotesContent = ({ notesData, onBackToNotes, onRestore }) => {
  const trashedNotes = notesData.filter((n) => n.deletedAt);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
      <div className="mb-6 flex items-center justify-between animate-slideInLeft">
        <div className="text-white text-xl font-bold tracking-tight flex items-center gap-2">
          <TrashIcon className="w-5 h-5 text-red-400" />
          Trashed Notes
        </div>
        <button
          onClick={onBackToNotes}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-lg"
        >
          ← Back to Notes
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {trashedNotes.length === 0 && (
          <div className="col-span-full bg-[#0a0a0a] border border-gray-700 rounded-xl p-12 text-center text-gray-400 animate-fadeIn">
            <div className="text-5xl mb-4 opacity-50">🗑️</div>
            <p className="text-base">No trashed notes.</p>
            <p className="text-sm text-gray-500 mt-2">Deleted notes will stay here temporarily.</p>
          </div>
        )}
        {trashedNotes.map((note, index) => (
          <div key={`note-${note.id}-${note.deletedAt || ''}`} className="animate-scaleIn" style={{ animationDelay: `${index * 0.05}s` }}>
            <TrashedNoteCard note={note} onRestore={onRestore} />
          </div>
        ))}
      </div>
    </div>
  );
};


export default NotesContent;

