import React, { useState, useRef } from 'react';
import { CreateNewCard } from './ProfileNavigation';
import FileUploadDropzone from './FileUploadDropzone';
import FileNoteCard from '../notes/FileNoteCard';
import AddNoteModal from './AddNoteModal';
import { noteService } from '../../services/noteService';
import { useUser } from '../../context/UserContext';


// ===== NOTE CARD =====

export const NoteCard = ({ note, openMenuId, onMenuToggle, onDelete }) => {
  return (
    <div className={`bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 rounded-xl overflow-hidden transition-all hover:shadow-xl h-[240px] w-full flex flex-col`}>
      <div className="relative">
        {/* Note card menu */}
        <div className="absolute top-2 right-2 card-options-menu z-20">
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              onMenuToggle(note.id || note.noteId); 
            }}
            className="p-1.5 bg-black/30 hover:bg-black/50 rounded-md text-white/80"
            title="Options"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          {openMenuId === (note.id || note.noteId) && (
            <div className="absolute right-0 mt-2 w-40 bg-[#111] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onDelete(note.id || note.noteId, note.title); 
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-white font-bold text-sm mb-2 truncate">
          {note.title}
        </h3>
        <div className="text-[11px] text-gray-400 mb-2 flex items-center gap-1">
          <svg className="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{new Date(note.createdAt).toLocaleDateString(undefined,{ month:'short', day:'numeric', year:'numeric'})}</span>
        </div>
        <div className="text-xs text-gray-500 line-clamp-5 overflow-hidden" dangerouslySetInnerHTML={{ __html: note.content }} />
      </div>
    </div>
  );
};


// ===== FAVOURITE NOTE CARD =====

export const FavouriteNoteCard = ({ note }) => {
  return null; // Removed - favorites feature is no longer available
};


// ===== NOTES CONTENT =====

export const NotesContent = ({ notesData, openNoteMenuId, onCreateNote, onMenuToggle, onDelete }) => {
  const { getUserId } = useUser();
  const [isDragActive, setIsDragActive] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
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
        }
      } catch (err) {
        console.error('File upload failed', err);
        alert(`Failed to upload file: ${err.message}`);
      }
    }
  };

  const handleAddNoteClick = () => {
    setShowAddNoteModal(true);
  };

  const handleNoteAdded = (created) => {
    if (typeof onCreateNote === 'function') {
      onCreateNote(created);
    }
  };

  // Filter notes - only exclude archived and deleted
  const filteredNotes = notesData.filter((n) => !n.archivedAt && !n.deletedAt);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 relative"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        <CreateNewCard onClick={handleAddNoteClick} label={"Add Note"} />
        {filteredNotes.map((note) => {
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
                onDelete={onDelete}
              />
            );
          })}
      </div>

      {isDragActive && (
        <FileUploadDropzone
          variant="overlay"
          active={isDragActive}
          onUploaded={(created) => {
            if (typeof onCreateNote === 'function') {
              onCreateNote(created);
            }
          }}
        />
      )}

      <AddNoteModal
        isOpen={showAddNoteModal}
        onClose={() => setShowAddNoteModal(false)}
        onNoteAdded={handleNoteAdded}
      />
    </div>
  );
};



// ===== FAVOURITES CONTENT =====

export const FavouritesContent = ({ notesData, onBackToNotes }) => {
  return null; // Removed - favorites feature is no longer available
};

// ===== TRASHED NOTES CONTENT =====

export const TrashedNotesContent = ({ trashedNotes, loading, onRestore, onBackToNotes }) => {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-white text-lg font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Trashed Notes
        </div>
        <button
          onClick={onBackToNotes}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm"
        >
          Back to Notes
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-6 h-6 border-2 border-gray-600 border-t-indigo-500 rounded-full"></div>
        </div>
      ) : trashedNotes && trashedNotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {trashedNotes.map((note) => {
            const isFileNote = note.type === 'FILE';
            const title = note.title || note.raw?.title || 'Untitled Note';
            const createdAt = note.createdAt || note.raw?.createdAt;
            
            return (
              <div
                key={note.id || note.noteId}
                className="bg-[#1a1a1a] border border-gray-800 hover:border-red-500/50 rounded-xl overflow-hidden transition-all hover:shadow-xl h-[240px] w-full flex flex-col relative group"
              >
                {/* Note type icon and restore button */}
                <div className="absolute top-2 right-2 flex gap-2 z-20">
                  <button
                    onClick={() => onRestore(note.id || note.noteId, title)}
                    className="p-2 bg-green-600 hover:bg-green-700 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Restore note"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-white font-bold text-sm mb-2 truncate">
                    {title}
                  </h3>
                  <div className="text-[11px] text-gray-400 mb-2">
                    Deleted: {createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown date'}
                  </div>
                  {isFileNote && (
                    <div className="text-xs text-gray-500 truncate">
                      {note.filePath ? note.filePath.split('/').pop() : 'File'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="col-span-full bg-[#0a0a0a] border border-gray-700 rounded-xl p-12 text-center text-gray-500 text-sm">
          No trashed notes.
        </div>
      )}
    </div>
  );
};


export default NotesContent;

