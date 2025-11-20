import React from 'react';
import { StarSolidIcon, CalendarIcon } from '../../icons';
import { getCategoryColor } from '../../utils/categoryUtils';

// Category Badge Component
const CategoryBadge = ({ category }) => {
  const colors = getCategoryColor(category);
  
  return (
    <span
      className="px-3 py-1 text-xs rounded-full bg-opacity-20 whitespace-nowrap"
      style={{
        backgroundColor: colors.bg,
        color: colors.text
      }}
    >
      {category}
    </span>
  );
};

// Note Card Component - General use (no menu)
const NoteCard = ({ note }) => {
  return (
    <div className={`bg-[#1a1a1a] border ${note.isFavourite ? 'border-yellow-400/50' : 'border-gray-800'} hover:border-gray-700 rounded-xl overflow-hidden transition-all hover:shadow-xl h-[240px] w-full flex flex-col`}>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-white font-bold text-sm mb-2 truncate flex items-center gap-1">
          {note.title}
          {note.isFavourite && <StarSolidIcon className="w-3 h-3 text-yellow-400" />}
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

// Note Card Component - Notes Page Version
const NoteCardPage = ({ title, categories }) => {
  return (
    <div className="bg-[#1f1f1f] rounded-xl p-6 hover:bg-[#2a2a2a] transition-all duration-300 cursor-pointer group h-[200px] flex flex-col">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3 overflow-hidden max-h-[48px]">
            {Array.isArray(categories) ? (
              categories.map((category, index) => (
                <CategoryBadge key={index} category={category} />
              ))
            ) : (
              <CategoryBadge category={categories} />
            )}
          </div>
          <div className="flex items-start gap-3">
            <h3 className="text-lg font-semibold text-white line-clamp-3 overflow-hidden">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

// Note Card Component - Dashboard Version
const NoteCardDashboard = ({ note }) => {
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

// Notes Grid Component
const NotesGrid = ({ notes }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
      {notes.map((note) => (
        <NoteCard
          key={note.noteId || note.id}
          note={note}
        />
      ))}
    </div>
  );
};

// Notes Header Component
const NotesHeader = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Notes</h1>
    </div>
  );
};

// Notes Empty State Component
const NotesEmptyState = () => {
  return (
    <div className="text-gray-400">No notes found.</div>
  );
};

// Notes Tabs Component
const NotesTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-3 mb-4">
      <button
        onClick={() => onTabChange('my')}
        className={`px-5 py-2 rounded-full font-semibold transition-all text-sm ${
          activeTab === 'my'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        My Notes
      </button>
      <button
        onClick={() => onTabChange('saved')}
        className={`px-5 py-2 rounded-full font-semibold transition-all text-sm ${
          activeTab === 'saved'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        Saved Notes
      </button>
    </div>
  );
};

// Notes Section Component - Dashboard Version
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
          <NoteCardDashboard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
};

export { 
  CategoryBadge, 
  NoteCard,
  NoteCardPage, 
  NoteCardDashboard, 
  NotesGrid, 
  NotesHeader, 
  NotesEmptyState, 
  NotesTabs, 
  NotesSection 
};
export default NotesSection;
