import React from 'react';
import FavouriteNoteCard from './FavouriteNoteCard';

const FavouritesContent = ({ notesData, onBackToNotes }) => {
  const favouriteNotes = notesData.filter((n) => n.isFavourite && !n.archivedAt && !n.deletedAt);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-white text-lg font-semibold">Favourite Notes</div>
        <button
          onClick={onBackToNotes}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm"
        >
          Back to Notes
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {favouriteNotes.length === 0 && (
          <div className="col-span-full bg-[#0a0a0a] border border-gray-700 rounded-xl p-12 text-center text-gray-500 text-sm">
            No favourite notes yet.
          </div>
        )}
        {favouriteNotes.map((note) => (
          <FavouriteNoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
};

export default FavouritesContent;
