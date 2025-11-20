import React from 'react';
import { Link } from 'react-router-dom';

// Notes Empty State Component
const NotesEmptyState = () => {
  return (
    <div className="text-center py-4">
      <p className="text-gray-400 text-sm mb-2">You haven't created any notes yet.</p>
      <Link 
        to="/create-note" 
        className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-500"
      >
        Create a note
      </Link>
    </div>
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

// Note Card Component
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

// Notes Section Component
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

export { NotesEmptyState, NotesTabs, NoteCard, NotesSection };
export default NotesSection;
