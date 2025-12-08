import React, { useState, useEffect } from 'react';
import { noteService } from '../../services/noteService';
import { sessionService } from '../../services/SessionService';

/**
 * UploadNoteModal Component
 * Three modes:
 * 1. "profile" - Shows session association + upload (from Profile > Notes tab)
 * 2. "session" - Shows only upload (from Session page, auto-associates with that session)
 * 3. "session" (no sessionId) - Shows upload for session being created (notes stored temporarily)
 */
const UploadNoteModal = ({ 
  isOpen, 
  onClose, 
  mode = 'profile', // 'profile' or 'session'
  sessionId = null, // Required when mode='session'
  onUploadSuccess = null // Callback after successful upload
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(sessionId || '');
  const [availableSessions, setAvailableSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Fetch user sessions when in profile mode
  useEffect(() => {
    if (isOpen && mode === 'profile') {
      fetchUserSessions();
    }
  }, [isOpen, mode]);

  const fetchUserSessions = async () => {
    try {
      setLoading(true);
      const sessions = await sessionService.getUserHostedSessions();
      setAvailableSessions(sessions || []);
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target?.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError(null);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleOk = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Determine which session to associate with
      const targetSessionId = mode === 'session' ? sessionId : selectedSessionId;

      // Upload the file
      const metadata = {
        title: selectedFile.name,
        sessionId: targetSessionId || undefined
      };

      const uploadedNote = await noteService.uploadFileNote(selectedFile, metadata);

      // Reset and close
      handleClose();
      
      // Call success callback if provided
      if (onUploadSuccess) {
        // Always pass just the filepath string for consistency
        // This allows the parent component to track notes uniformly
        if (uploadedNote.filepath) {
          onUploadSuccess(uploadedNote.filepath);
        }
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('Upload failed:', err);
      const errorMessage = err.message || 'Failed to upload file';
      
      // Check if it's a 403/404 error (endpoint not implemented)
      if (errorMessage.includes('403') || errorMessage.includes('404')) {
        setError('Upload feature is not yet available. The backend endpoint needs to be implemented.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setSelectedSessionId(sessionId || '');
    setError(null);
    setDragActive(false);
    onClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-4" 
      onClick={handleCancel}
    >
      <div 
        className="w-full max-w-4xl animate-slideUp" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-lg shadow-2xl overflow-hidden group">
          {/* Sweep bright effect - animates on mount and hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-sweepOnce pointer-events-none"></div>
          
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
            <h3 className="text-xl font-semibold text-white tracking-tight">
              {mode === 'session' && !sessionId ? 'Add Session Notes' : 'Upload Note'}
            </h3>
            <button
              onClick={handleCancel}
              className="p-1.5 hover:bg-gray-700/50 rounded-full transition-all duration-200 hover:rotate-90"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content - Horizontal Layout */}
          <div className="flex flex-col gap-4 px-6 py-5">
            
            {/* Info Message for Session Creation Mode */}
            {mode === 'session' && !sessionId && (
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 flex items-start gap-3 animate-fadeIn">
                <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-indigo-200 font-medium mb-1">Notes for New Session</p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    These notes will be automatically associated with your session once it's created. You can upload multiple files.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-6">
              {/* Left Column - Session Selection (Only in profile mode) */}
              {mode === 'profile' && (
              <div className="w-1/3 animate-fadeIn">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Associate With Session <span className="text-red-400">*</span>
                </label>
                {loading ? (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-md p-4 flex items-center justify-center text-gray-400 animate-pulse">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Loading...</span>
                    </div>
                  </div>
                ) : availableSessions.length === 0 ? (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-md p-4 flex items-center justify-center text-center text-gray-400 text-sm">
                    No sessions available
                  </div>
                ) : (
                  <select
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#1e293b] border border-gray-700 rounded-md text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-600"
                  >
                    <option value="">Select a session</option>
                    {availableSessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

              {/* Right Column - Upload Area */}
              <div className={`${mode === 'profile' ? 'w-2/3' : 'w-full'} animate-fadeIn`}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {mode === 'session' && sessionId ? 'Upload Note for This Session' : mode === 'session' ? 'Upload Session Materials' : 'Upload File'}
                </label>
              
              {/* Drag and Drop Area - Compact */}
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-md p-6 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
                    : 'border-gray-700 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
                }`}
              >
                <input
                  type="file"
                  id="file-upload-input"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                
                {selectedFile ? (
                  <div className="space-y-3 animate-fadeIn">
                    {/* File Preview */}
                    {filePreview ? (
                      <div className="flex justify-center">
                        <img 
                          src={filePreview} 
                          alt="Preview" 
                          className="max-h-32 rounded-md border border-gray-700 shadow-sm"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    {/* File Info */}
                    <div>
                      <p className="text-white font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-gray-400 text-xs">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                    
                    {/* Change File Button */}
                    <button
                      onClick={() => document.getElementById('file-upload-input').click()}
                      className="px-3 py-1.5 bg-gray-700 border border-gray-600 hover:bg-gray-600 text-gray-200 rounded-md text-xs font-medium transition-all duration-200 hover:shadow-sm"
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium text-sm mb-0.5">Drag & drop a file here</p>
                      <p className="text-gray-400 text-xs mb-3">PDF, images, or documents</p>
                    </div>
                    <label
                      htmlFor="file-upload-input"
                      className="inline-block px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm rounded-md font-medium cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>

          {/* Error Message - Full Width Below */}
          {error && (
            <div className="mx-6 mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-md text-red-400 text-xs animate-shake">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 px-6 py-4 bg-gray-800/50 border-t border-gray-700/50">
            <button
              onClick={handleCancel}
              disabled={uploading}
              className="flex-1 px-5 py-2 bg-gray-700 border border-gray-600 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-gray-200 text-sm rounded-md font-medium transition-all duration-200 hover:shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleOk}
              disabled={!selectedFile || uploading}
              className="flex-1 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white text-sm rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </span>
              ) : (
                'Upload'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadNoteModal;
