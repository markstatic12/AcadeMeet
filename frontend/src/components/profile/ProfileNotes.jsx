import React, { useState, useRef } from 'react';
import { CalendarIcon } from '../../icons';
import FileNoteCard from '../notes/FileNoteCard';
import UploadNoteModal from '../notes/UploadNoteModal';
import { CreateNewCard } from './ProfileNavigation';
import { noteService } from '../../services/noteService';
import { useUser } from '../../context/UserContext';


// ===== NOTE CARD =====

export const NoteCard = ({ note }) => {
  return (
    <div className={`relative bg-[#161A2B] border ${note.isFavourite ? 'border-yellow-400/60 shadow-lg shadow-yellow-500/20' : 'border-gray-700/50'} rounded-2xl overflow-hidden transition-all hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/20 h-[180px] w-full flex flex-col group hover:scale-[1.02]`}>
      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-all duration-700 pointer-events-none"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 left-4 w-16 h-16 bg-indigo-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-4 right-4 w-20 h-20 bg-indigo-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      

      
      {/* Gradient accent line top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent group-hover:via-indigo-500 transition-all duration-300"></div>
      
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





// ===== NOTES CONTENT =====

export const NotesContent = ({ notesData }) => {
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
                <NoteCard note={note} />
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






export default NotesContent;

