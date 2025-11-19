import React from 'react';
import CreateNewCard from './CreateNewCard';
import NoteCard from './NoteCard';

const NotesContent = ({ notesData, openNoteMenuId, onCreateNote, onMenuToggle, onToggleFavourite, onArchive, onDelete }) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        <CreateNewCard onClick={onCreateNote} label="Create New Note" />
        {notesData
          .filter((n) => !n.archivedAt && !n.deletedAt)
          .map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              openMenuId={openNoteMenuId}
              onMenuToggle={onMenuToggle}
              onToggleFavourite={onToggleFavourite}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          ))}
      </div>
    </div>
  );
};

export default NotesContent;
