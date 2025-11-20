import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { NotesHeader, NotesGrid } from '../components/notes/Notes';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { useNotesPage } from '../logic/notes/NotesPage.logic';
import '../styles/notes/NotesPage.css';

const NotesPage = () => {
  const { notes, loading, error } = useNotesPage();

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
