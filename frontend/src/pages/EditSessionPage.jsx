import React from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import SessionHeader, { DetailsPanel, DescriptionPanel } from '../components/sessions/SessionForm';
import { useEditSessionForm } from '../services/SessionLogic';
import '../styles/createSession/CreateSessionPage.css';

const EditSessionPage = () => {
  const { sessionId } = useParams();
  const {
    sessionData,
    loading,
    isSubmitting,
    handleChange,
    handlePasswordChange,
    handleParticipantsChange,
    handleTagsChange,
    handleSubmit,
    handleBack
  } = useEditSessionForm(sessionId);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
        <div className="relative z-10 p-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-white">Loading session...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <div className="relative z-10 p-8 animate-fadeIn">
        <form onSubmit={handleSubmit}>
          <PageHeader 
            onBack={handleBack} 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            showSubmit={true}
            submitText="Save Changes"
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
              onTagsChange={handleTagsChange}
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

export default EditSessionPage;