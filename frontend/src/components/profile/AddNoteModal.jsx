import React, { useState, useEffect, useRef } from 'react';
import { sessionService } from '../../services/SessionService';
import { noteService } from '../../services/noteService';
import { useUser } from '../../context/UserContext';

export default function AddNoteModal({ isOpen, onClose, onNoteAdded, sessionId }) {
  const { getUserId } = useUser();
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const dragCounter = useRef(0);
  const fileInputRef = useRef(null);

  // If sessionId is provided (from Session page), use it directly
  const isSessionContext = !!sessionId;

  useEffect(() => {
    if (isOpen && !isSessionContext) {
      // Only load sessions if we're in Profile context (no sessionId provided)
      loadSessions();
    }
  }, [isOpen, isSessionContext]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserId();
      const sessionsData = await sessionService.getSessionsForLinking(userId);
      setSessions(sessionsData || []);
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setError('Failed to load sessions');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

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
      setSelectedFile(files[0]);
      setError(null);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target?.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setError(null);
    }
  };

  const handleOK = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const userId = getUserId();
      // Use provided sessionId if in Session context, otherwise use selected session
      const sessionIds = isSessionContext 
        ? [sessionId] 
        : (selectedSessionId ? [selectedSessionId] : []);
      const created = await noteService.uploadFileNote(selectedFile, { title: selectedFile.name, sessionIds }, userId);
      
      if (onNoteAdded) {
        onNoteAdded(created);
      }
      
      // Reset modal state and close
      setSelectedFile(null);
      setSelectedSessionId(null);
      setError(null);
      onClose();
    } catch (err) {
      console.error('Upload failed', err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setSelectedSessionId(null);
    setError(null);
    onClose();
  };

  const formatSessionTime = (session) => {
    try {
      if (!session) return 'Date TBD';
      const { month, day, year, startTime } = session;
      if (month && day && year) {
        return `${month} ${day}, ${year}${startTime ? ` ${startTime}` : ''}`;
      }
      return 'Date TBD';
    } catch {
      return 'Date TBD';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">
            {isSessionContext ? 'Upload Note' : 'Add Note'}
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Associate With a Session - Only show in Profile context */}
          {!isSessionContext && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Associate With a Session (Optional)</h4>
              <div className="bg-gray-800 rounded-lg p-3">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-gray-600 border-t-indigo-500 rounded-full"></div>
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-sm">
                    No sessions available
                  </div>
                ) : (
                  <select
                    value={selectedSessionId || ''}
                    onChange={(e) => setSelectedSessionId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a session (optional)</option>
                    {sessions.map(session => (
                      <option key={session.id} value={session.id}>
                        {session.title} - {formatSessionTime(session)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          )}

          {/* Section 2: Upload New Note */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Upload New Note</h4>
            
            {!selectedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragActive
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-gray-700 bg-gray-800/50'
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors ${
                    isDragActive ? 'bg-indigo-600/30' : 'bg-gray-700'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-gray-300 mb-2">Drag & drop a file here</p>
                  <p className="text-gray-500 text-sm mb-4">or</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    Choose File
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-indigo-500 bg-indigo-500/10 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">{selectedFile.name}</p>
                      <p className="text-gray-400 text-sm">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    title="Remove file"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={handleCancel}
            disabled={uploading}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleOK}
            disabled={uploading || !selectedFile}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
}
