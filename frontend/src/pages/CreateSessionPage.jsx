import React, { useRef, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
// Session pieces are consolidated in SessionForm.jsx
import SessionHeader, { DetailsPanel, DescriptionPanel } from '../components/sessions/SessionForm';
import { useSessionForm } from '../services/SessionLogic';
import '../styles/createSession/CreateSessionPage.css';

const CreateSessionPage = () => {
  const {
    sessionData,
    isSubmitting,
    handleChange,
    handlePasswordChange,
    handleParticipantsChange,
    handleSubmit,
    handleBack,
    pendingNote,
    setPendingNote
  } = useSessionForm();

  const [isDragActive, setIsDragActive] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef(null);

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
      setPendingNote(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target?.files;
    if (files && files.length > 0) {
      setPendingNote(files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <div className="relative z-10 p-8 animate-fadeIn">
        <form onSubmit={handleSubmit}>
          <PageHeader 
            onBack={handleBack} 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            showSubmit={true}
            submitText="Create Session"
          />

          <SessionHeader
            title={sessionData.title}
            onChange={handleChange}
          />

          <div className="grid grid-cols-3 gap-8 mt-6">
            <DetailsPanel
              sessionData={sessionData}
              onChange={handleChange}
              onPasswordChange={handlePasswordChange}
              onParticipantsChange={handleParticipantsChange}
            />

            <DescriptionPanel
              value={sessionData.description}
              onChange={handleChange}
            />
          </div>

          {/* Note Upload Section */}
          <div className="mt-8 bg-[#1a1a1a] rounded-2xl p-6">
            <h3 className="text-white font-bold text-xl mb-4">Attach a Note (Optional)</h3>
            <p className="text-gray-400 text-sm mb-4">Upload a note file that will be automatically associated with this session after creation.</p>
            
            {!pendingNote ? (
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
                  <p className="text-gray-300 mb-2">Drag & drop a note file here</p>
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
              <div className="border-2 border-indigo-500 bg-indigo-500/10 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">{pendingNote.name}</p>
                    <p className="text-gray-400 text-sm">{(pendingNote.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingNote(null)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                  title="Remove file"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionPage;
