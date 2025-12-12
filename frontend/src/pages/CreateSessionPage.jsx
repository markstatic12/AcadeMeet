import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
// Session pieces are consolidated in SessionForm.jsx
import SessionHeader, { DetailsPanel, DescriptionPanel } from '../components/sessions/SessionForm';
import { useSessionForm } from '../services/SessionLogic';
import UploadNoteModal from '../components/notes/UploadNoteModal';
import Toast from '../components/common/Toast';
import useToast from '../hooks/useToast';
import '../styles/createSession/CreateSessionPage.css';

const CreateSessionPage = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  
  const {
    sessionData,
    isSubmitting,
    fieldErrors,
    handleChange,
    handlePasswordChange,
    handleParticipantsChange,
    handleTagsChange,
    handleSubmit,
    handleBack,
    addUploadedNoteFilepath
  } = useSessionForm(showToast);

  return (
    <div className="h-screen bg-gradient-to-br from-[#0a0a14] via-[#0f0f1e] to-[#1a1a2e] relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(99,102,241,0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 h-full flex flex-col max-w-[1600px] mx-auto w-full px-8 py-5 animate-fadeIn">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          {/* Header with Back Button and Floating Create Button */}
          <div className="flex items-center justify-between mb-5 flex-shrink-0">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-3 text-white hover:text-indigo-300 transition-colors group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="text-lg font-medium">Back</span>
            </button>

            {/* Floating CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative overflow-hidden px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-2xl shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:shadow-indigo-500/60 hover:scale-105 group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></div>
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="relative z-10">Creating...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="relative z-10">Create Session</span>
                </>
              )}
            </button>
          </div>

          {/* Main Content Card */}
          <div className="flex-1 relative overflow-hidden">
            <div className="relative h-full flex flex-col">
              {/* Session Title Input - Fixed at top */}
              <div className="flex items-center gap-4 p-6 pb-5 border-b border-indigo-900/20 flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 5h13v7h2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8v-2H4V5zm16 10l-4-4v3H9v2h7v3l4-4z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-400 text-xs font-medium mb-1.5">
                    Session Title {fieldErrors.title && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={sessionData.title}
                    onChange={handleChange}
                    placeholder="Enter a compelling session name..."
                    required
                    className={`w-full bg-transparent border-none text-2xl font-bold text-white placeholder-gray-600 focus:outline-none focus:ring-0 p-0 ${
                      fieldErrors.title ? 'text-red-400' : ''
                    }`}
                  />
                  {fieldErrors.title && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.title}</p>
                  )}
                </div>
              </div>

              {/* Scrollable Two-Column Layout */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DetailsPanel
                    sessionData={sessionData}
                    fieldErrors={fieldErrors}
                    onChange={handleChange}
                    onPasswordChange={handlePasswordChange}
                    onParticipantsChange={handleParticipantsChange}
                    onTagsChange={handleTagsChange}
                    onUploadNotesClick={() => setIsUploadModalOpen(true)}
                    uploadedNotes={sessionData.uploadedNoteFilepaths || []}
                    onRemoveNote={(index) => {
                      const newFilepaths = [...sessionData.uploadedNoteFilepaths];
                      newFilepaths.splice(index, 1);
                      handleChange({ target: { name: 'uploadedNoteFilepaths', value: newFilepaths } });
                    }}
                  />

                  <DescriptionPanel
                    value={sessionData.description}
                    onChange={handleChange}
                    fieldErrors={fieldErrors}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      <Toast {...toast} onClose={hideToast} />

      {/* Upload Note Modal - Rendered at page level for full-screen overlay */}
      <UploadNoteModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        mode="session"
        sessionId={null}
        onUploadSuccess={(filepath) => {
          addUploadedNoteFilepath(filepath);
          showToast('success', 'Note uploaded successfully!');
        }}
      />
    </div>
  );
};

export default CreateSessionPage;
