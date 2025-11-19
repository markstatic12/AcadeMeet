import React from 'react';
import NoteCard from './NoteCard';

const NotesGrid = ({ notes }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-10">
      {notes.map((note) => (
        <NoteCard
          key={note.noteId || note.id}
          title={note.title}
          categories={(note.tags || []).map(t => t.name)}
        />
      ))}
    </div>
  );
};

export default NotesGrid;
