import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import NotesHeader from '../components/notes/NotesHeader';
import NotesGrid from '../components/notes/NotesGrid';
import LoadingState from '../components/notes/LoadingState';
import ErrorState from '../components/notes/ErrorState';
import EmptyState from '../components/notes/EmptyState';
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
