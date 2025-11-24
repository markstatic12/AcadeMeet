import React from 'react';

export default function FileNoteCard({ note, onOpen, onMenu }) {
  const { title, notePreviewImageUrl, createdAt, tags, isFavourite } = note || {};
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString(undefined,{ month:'short', day:'numeric', year:'numeric'}) : '';

  return (
    <div
      className={`bg-[#1a1a1a] border ${isFavourite ? 'border-yellow-400/50' : 'border-gray-800'} hover:border-gray-700 rounded-xl overflow-hidden transition-all hover:shadow-xl h-[240px] w-full flex flex-col cursor-pointer`}
      onClick={() => onOpen && onOpen(note)}
    >
      <div className="h-28 w-full bg-cover bg-center" style={{ backgroundImage: `url(${notePreviewImageUrl || '/assets/default-file-preview.png'})` }} />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-white font-bold text-sm mb-2 truncate flex items-center gap-1">
          {title || 'Untitled'}
        </h3>
        <div className="text-[11px] text-gray-400 mb-2 flex items-center gap-1">
          <span>{formattedDate}</span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Array.isArray(tags) && tags.slice(0,3).map(tag => (
              <span key={tag.tagId || tag.id || tag} className="text-xs text-gray-300 bg-gray-800/40 px-2 py-1 rounded-full">{tag.name || tag}</span>
            ))}
            {Array.isArray(tags) && tags.length > 3 && (
              <span className="text-xs text-gray-300 bg-gray-800/40 px-2 py-1 rounded-full">+{tags.length - 3}</span>
            )}
          </div>
          <button className="text-gray-400 hover:text-white" onClick={(e)=>{ e.stopPropagation(); onMenu && onMenu(note); }} aria-label="Open menu">⋮</button>
        </div>
      </div>
    </div>
  );
}
