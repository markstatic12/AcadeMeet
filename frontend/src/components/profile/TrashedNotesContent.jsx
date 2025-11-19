import React from 'react';
import TrashedNoteCard from './TrashedNoteCard';

const TrashedNotesContent = ({ notesData, onBackToNotes, onRestore }) => {
  const trashedNotes = notesData.filter((n) => n.deletedAt);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-white text-lg font-semibold">Trashed Notes</div>
        <button
          onClick={onBackToNotes}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm"
        >
          Back to Notes
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {trashedNotes.map((note) => (
          <TrashedNoteCard key={note.id} note={note} onRestore={onRestore} />
        ))}
      </div>
    </div>
  );
};

export default TrashedNotesContent;
