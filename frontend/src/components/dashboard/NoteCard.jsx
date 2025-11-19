import React from 'react';

const NoteCard = ({ note }) => {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors cursor-pointer">
      <div className={`${note.iconBg || 'bg-blue-500'} w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
        {note.icon || '📄'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium mb-1">{note.title}</p>
        <p className="text-gray-400 text-xs">{note.date || note.createdAt || ''}</p>
      </div>
    </div>
  );
};

export default NoteCard;
