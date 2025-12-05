import React from 'react';
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
    handleTagsChange,
    handleSubmit,
    handleBack
  } = useSessionForm();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 animate-fadeIn">
        <form onSubmit={handleSubmit} className="space-y-8">
          <PageHeader 
            onBack={handleBack} 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            showSubmit={true}
            submitText="Create Session"
          />

          {/* Main Content Card */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            {/* Sweep effect on hover */}
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
              
              <SessionHeader
                title={sessionData.title}
                onChange={handleChange}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <DetailsPanel
                  sessionData={sessionData}
                  onChange={handleChange}
                  onPasswordChange={handlePasswordChange}
                  onParticipantsChange={handleParticipantsChange}
                  onTagsChange={handleTagsChange}
                />

                <DescriptionPanel
                  value={sessionData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionPage;
