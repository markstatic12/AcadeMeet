import React, { useState, useRef } from 'react';
import { ThreeDotsVerticalIcon, StarOutlineIcon, StarSolidIcon, ArchiveIcon, TrashIcon, CalendarIcon } from '../../icons';
import { CreateNewCard } from './ProfileNavigation';
import FileUploadDropzone from './FileUploadDropzone';
import FileNoteCard from '../notes/FileNoteCard';
import { noteService } from '../../services/noteService';
import { useUser } from '../../context/UserContext';


// ===== NOTE CARD =====

export const NoteCard = ({ note, openMenuId, onMenuToggle, onToggleFavourite, onArchive, onDelete }) => {
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


// ===== FAVOURITE NOTE CARD =====

export const FavouriteNoteCard = ({ note }) => {
  return (
    <div className="bg-[#1a1a1a] border border-yellow-400/50 rounded-xl overflow-hidden h-[240px] w-full flex flex-col">
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-white font-bold text-sm mb-2 truncate flex items-center gap-1">
          {note.title} <StarSolidIcon className="w-3 h-3 text-yellow-400" />
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


// ===== ARCHIVED NOTE CARD =====

export const ArchivedNoteCard = ({ note, onRestore }) => {
  return (
    <div className="relative bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden h-[240px] w-full flex flex-col">
      {/* Vertical Restore action */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
        <button
          onClick={() => onRestore(note.id)}
          className="px-2 py-1 text-xs rounded-lg bg-green-600/20 text-green-300 border border-green-500/40 hover:bg-green-600/30"
        >
          Restore
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col opacity-80">
        <h3 className="text-white font-bold text-sm mb-2 truncate">{note.title}</h3>
        <div className="text-[11px] text-gray-400 mb-2 flex items-center gap-1">
          <CalendarIcon className="w-3 h-3 text-indigo-400" />
          <span>{new Date(note.createdAt).toLocaleDateString(undefined,{ month:'short', day:'numeric', year:'numeric'})}</span>
        </div>
        <div className="text-xs text-gray-500 line-clamp-5 overflow-hidden" dangerouslySetInnerHTML={{ __html: note.content }} />
      </div>
    </div>
  );
};


// ===== TRASHED NOTE CARD =====

export const TrashedNoteCard = ({ note, onRestore }) => {
  return (
    <div className="relative bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden h-[240px] w-full flex flex-col">
      {/* Vertical Restore action */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
        <button
          onClick={() => onRestore(note.id)}
          className="px-2 py-1 text-xs rounded-lg bg-green-600/20 text-green-300 border border-green-500/40 hover:bg-green-600/30"
        >
          Restore
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col opacity-60">
        <h3 className="text-white font-bold text-sm mb-2 truncate line-through">{note.title}</h3>
        <div className="text-[11px] text-gray-500 mb-2 flex items-center gap-1">
          <CalendarIcon className="w-3 h-3 text-indigo-400" />
          <span>{new Date(note.createdAt).toLocaleDateString(undefined,{ month:'short', day:'numeric', year:'numeric'})}</span>
        </div>
        <div className="text-xs text-gray-600 line-clamp-5 overflow-hidden" dangerouslySetInnerHTML={{ __html: note.content }} />
      </div>
    </div>
  );
};


// ===== NOTES CONTENT =====

export const NotesContent = ({ notesData, openNoteMenuId, onCreateNote, onMenuToggle, onToggleFavourite, onArchive, onDelete }) => {
  const { getUserId } = useUser();
  const [isDragActive, setIsDragActive] = useState(false);
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
        const userId = getUserId();
        const created = await noteService.uploadFileNote(file, { title: file.name }, userId);
        if (typeof onCreateNote === 'function') {
          onCreateNote(created);
        } else {
          try { window.location.reload(); } catch (_) {}
        }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        <CreateNewCard onClick={onCreateNote} label={"Create New Note or Drag & Drop a File"} />
        {notesData
          .filter((n) => !n.archivedAt && !n.deletedAt)
          .map((note) => {
            // Check if this is a FILE type note by looking at the raw data
            const isFileNote = note.raw?.type === 'FILE' || note.type === 'FILE';
            
            if (isFileNote) {
              return (
                <FileNoteCard
                  key={`note-${note.id}-${note.deletedAt || note.archivedAt || ''}`}
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
              );
            }
            
            return (
              <NoteCard
                key={`note-${note.id}-${note.deletedAt || note.archivedAt || ''}`}
                note={note}
                openMenuId={openNoteMenuId}
                onMenuToggle={onMenuToggle}
                onToggleFavourite={onToggleFavourite}
                onArchive={onArchive}
                onDelete={onDelete}
              />
            );
          })}
      </div>

      {isDragActive && (
        <FileUploadDropzone
          variant="overlay"
          active={isDragActive}
          // onUploaded still used for click-select uploads
          onUploaded={(created) => {
            if (typeof onCreateNote === 'function') {
              try { onCreateNote(created); return; } catch (err) { console.warn('onCreateNote handler failed', err); }
            }
            try { window.location.reload(); } catch (err) { console.warn('Reload failed', err); }
          }}
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
      <div className="mb-4 flex items-center justify-between">
        <div className="text-white text-lg font-semibold">Favourite Notes</div>
        <button
          onClick={onBackToNotes}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm"
        >
          Back to Notes
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {favouriteNotes.length === 0 && (
          <div className="col-span-full bg-[#0a0a0a] border border-gray-700 rounded-xl p-12 text-center text-gray-500 text-sm">
            No favourite notes yet.
          </div>
        )}
        {favouriteNotes.map((note) => (
          <FavouriteNoteCard key={`note-${note.id}-${note.archivedAt || note.deletedAt || ''}`} note={note} />
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
      <div className="mb-4 flex items-center justify-between">
        <div className="text-white text-lg font-semibold">Archived Notes</div>
        <button
          onClick={onBackToNotes}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm"
        >
          Back to Notes
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {archivedNotes.map((note) => (
          <ArchivedNoteCard key={`note-${note.id}-${note.archivedAt || note.deletedAt || ''}`} note={note} onRestore={onRestore} />
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
      <div className="mb-4 flex items-center justify-between">
        <div className="text-white text-lg font-semibold">Trashed Notes</div>
        <button
          onClick={onBackToNotes}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm"
        >
          Back to Notes
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {trashedNotes.map((note) => (
          <TrashedNoteCard key={`note-${note.id}-${note.deletedAt || ''}`} note={note} onRestore={onRestore} />
        ))}
      </div>
    </div>
  );
};


export default NotesContent;

