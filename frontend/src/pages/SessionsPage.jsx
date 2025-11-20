import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { SessionsHeader, SessionsGrid } from '../components/sessions/Sessions';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import { useSessionsPage } from '../logic/sessions/SessionsPage.logic';
import '../styles/sessions/SessionsPage.css';

const SessionsPage = () => {
  const { sessions, loading, error } = useSessionsPage();

  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState message={error} />;
    }

    if (sessions.length === 0) {
      return <EmptyState />;
    }

    return <SessionsGrid sessions={sessions} />;
  };

  return (
    <DashboardLayout>
      <div className="p-8 text-white min-h-screen">
        <SessionsHeader />
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default SessionsPage;