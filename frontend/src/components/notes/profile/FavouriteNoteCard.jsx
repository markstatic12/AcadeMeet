import React from 'react';
import { StarSolidIcon, CalendarIcon } from '../../icons';

const FavouriteNoteCard = ({ note }) => {
  return (
    <div className="bg-[#1a1a1a] border border-yellow-400/50 rounded-xl overflow-hidden h-[240px] w-full flex flex-col">
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-white font-bold text-sm mb-2 truncate flex items-center gap-1">
          {note.title} <StarSolidIcon className="w-3 h-3 text-yellow-400" />
        </h3>
        <div className="text-[11px] text-gray-400 mb-2 flex items-center gap-1">
          <CalendarIcon className="w-3 h-3 text-indigo-400" />
          <span>{new Date(note.createdAt).toLocaleDateString(undefined,{ month:'short', day:'numeric', year:'numeric'})}</span>
        </div>
        <div className="text-xs text-gray-500 line-clamp-5 overflow-hidden" dangerouslySetInnerHTML={{ __html: note.content }} />
      </div>
    </div>
  );
};

export default FavouriteNoteCard;
