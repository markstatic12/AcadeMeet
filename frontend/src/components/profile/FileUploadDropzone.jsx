import React, { useState } from 'react';
import { noteService } from '../../services/noteService';
import { useUser } from '../../context/UserContext';

export default function FileUploadDropzone({ onUploaded, variant = 'tile', active = false }) {
  const { getUserId } = useUser();
  const [dragOver, setDragOver] = useState(false); // used only for tile variant
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };

  const onDrop = async (e) => {
    prevent(e);
    setDragOver(false);
    const files = e.dataTransfer?.files || e.target?.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    await handleUpload(file);
  };

  const handleUpload = async (file) => {
    setError(null);
    setUploading(true);
    try {
      const userId = getUserId();
      // call the note service upload - backend endpoint expected at /api/notes/upload
      const created = await noteService.uploadFileNote(file, { title: file.name }, userId);
      // Notify parent and optionally refresh UI
      if (onUploaded) onUploaded(created);
      // default behaviour: reload to pick up new note
      try { window.location.reload(); } catch (err) { console.warn('Forced reload failed', err); }
    } catch (err) {
      console.error('Upload failed', err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const baseTileClasses = `bg-[#1a1a1a] border-2 ${dragOver ? 'border-indigo-500' : 'border-gray-700'} rounded-xl flex flex-col items-center justify-center h-[240px] w-full p-4 text-center cursor-pointer transition-colors`;
  // z-30 so overlay sits above card option icons (which use z-20)
  const overlayClasses = `absolute inset-0 z-30 bg-[#121212]/90 backdrop-blur-sm border-2 border-dashed ${active ? 'border-indigo-500' : 'border-gray-700'} rounded-xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-colors`;
  const containerClasses = variant === 'overlay' ? overlayClasses : baseTileClasses;

  return (
    <div
      className={containerClasses}
      // Only attach drag handlers for tile variant; overlay uses parent-level handlers to avoid flicker
      {...(variant === 'tile' ? {
        onDragEnter: (e) => { prevent(e); setDragOver(true); },
        onDragOver: (e) => { prevent(e); setDragOver(true); },
        onDragLeave: (e) => { prevent(e); setDragOver(false); },
        onDrop: onDrop,
      } : {})}
      role="button"
    >
      <input
        type="file"
        id="profile-note-file-input"
        className="hidden"
        onChange={(e) => onDrop(e)}
      />
      <div className="flex flex-col items-center">
        <div className={`w-16 h-16 ${(variant === 'overlay' ? active : dragOver) ? 'bg-indigo-600/30' : 'bg-[#2a2a2a]'} rounded-full flex items-center justify-center mb-3 transition-colors`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v10m0 0l-3-3m3 3l3-3M20 20H4" />
          </svg>
        </div>
        <div className="text-sm text-gray-300 mb-2 font-medium">Drag & drop a file here to upload as a note</div>
        {/* click-to-upload removed per request */}
        <label htmlFor="profile-note-file-input" className="sr-only">Upload file</label>
        {uploading && <div className="text-xs text-gray-400 mt-2">Uploading...</div>}
        {error && <div className="text-xs text-red-400 mt-2">{error}</div>}
      </div>
    </div>
  );
}
