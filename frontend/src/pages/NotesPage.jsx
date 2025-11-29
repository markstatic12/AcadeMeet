import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { NotesHeader, NotesGrid } from '../components/notes/Notes';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import { useNotesPage } from '../hooks/useNotesHooks';
import '../styles/notes/NotesPage.css';
import { useNavigate } from 'react-router-dom';

const NotesPage = () => {
  const { notes, loading, error } = useNotesPage();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <NotesHeader />

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : notes.length === 0 ? (
          <EmptyState />
        ) : (
          <NotesGrid notes={notes} />
        )}
      </div>
    </DashboardLayout>  
  );
};

export default NotesPage;
