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
    handleSubmit,
    handleBack
  } = useSessionForm();

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
        </form>
      </div>
    </div>
  );
};

export default CreateSessionPage;
