import React from 'react';
import { CalendarIcon } from '../../icons';

const TrashedNoteCard = ({ note, onRestore }) => {
  return (
    <div className="relative bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden h-[240px] w-full flex flex-col">
      {/* Vertical Restore action */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
        <button
          onClick={() => onRestore(note.id)}
          className="px-2 py-1 text-xs rounded-lg bg-green-600/20 text-green-300 border border-green-500/40 hover:bg-green-600/30"
        >
          Restore
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col opacity-60">
        <h3 className="text-white font-bold text-sm mb-2 truncate line-through">{note.title}</h3>
        <div className="text-[11px] text-gray-500 mb-2 flex items-center gap-1">
          <CalendarIcon className="w-3 h-3 text-indigo-400" />
          <span>{new Date(note.createdAt).toLocaleDateString(undefined,{ month:'short', day:'numeric', year:'numeric'})}</span>
        </div>
        <div className="text-xs text-gray-600 line-clamp-5 overflow-hidden" dangerouslySetInnerHTML={{ __html: note.content }} />
      </div>
    </div>
  );
};

export default TrashedNoteCard;
