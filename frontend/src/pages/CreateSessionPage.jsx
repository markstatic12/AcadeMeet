import React from 'react';
import PageHeader from '../components/createSession/PageHeader';
import SessionHeader from '../components/createSession/SessionHeader';
import DetailsPanel from '../components/createSession/DetailsPanel';
import DescriptionPanel from '../components/createSession/DescriptionPanel';
import { useCreateSessionPage } from '../logic/createSession/CreateSessionPage.logic';
import '../styles/createSession/CreateSessionPage.css';

const CreateSessionPage = () => {
  const {
    sessionData,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleBack
  } = useCreateSessionPage();

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <div className="relative z-10 p-8 animate-fadeIn">
        <form onSubmit={handleSubmit}>
          <PageHeader 
            onBack={handleBack} 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />

          <SessionHeader
            title={sessionData.title}
            onChange={handleChange}
          />

          <div className="grid grid-cols-3 gap-8">
            <DetailsPanel
              sessionData={sessionData}
              onChange={handleChange}
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
