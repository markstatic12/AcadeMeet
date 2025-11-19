import React from 'react';
import NotesTabs from './NotesTabs';
import NoteCard from './NoteCard';
import NotesEmptyState from './NotesEmptyState';

const NotesSection = ({ 
  activeTab, 
  onTabChange, 
  notes, 
  loading, 
  error 
}) => {
  return (
    <div>
      <NotesTabs activeTab={activeTab} onTabChange={onTabChange} />

      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 space-y-3">
        {loading && <p className="text-gray-400 text-sm">Loading notes...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {!loading && notes.length === 0 && <NotesEmptyState />}

        {!loading && notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
};

export default NotesSection;
