import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { noteService } from '../services/noteService';

const getCategoryColor = (category) => {
  const colors = {
    'Springboot': { bg: 'rgba(76, 175, 80, 0.2)', text: '#4CAF50' },
    'Excel': { bg: 'rgba(33, 150, 243, 0.2)', text: '#2196F3' },
    'Accounting': { bg: 'rgba(255, 152, 0, 0.2)', text: '#FF9800' },
    'Database': { bg: 'rgba(156, 39, 176, 0.2)', text: '#9C27B0' },
    'Web Development': { bg: 'rgba(233, 30, 99, 0.2)', text: '#E91E63' },
    'Data Science': { bg: 'rgba(0, 188, 212, 0.2)', text: '#00BCD4' }
  };
  return colors[category] || { bg: 'rgba(158, 158, 158, 0.2)', text: '#9E9E9E' };
};

const NoteCard = ({ title, categories}) => (
  <div className="bg-[#1f1f1f] rounded-xl p-6 hover:bg-[#2a2a2a] transition-all duration-300 cursor-pointer group h-[200px] flex flex-col">
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-3 overflow-hidden max-h-[48px]">
          {Array.isArray(categories) ? categories.map((category, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs rounded-full bg-opacity-20 whitespace-nowrap"
              style={{
                backgroundColor: getCategoryColor(category).bg,
                color: getCategoryColor(category).text
              }}
            >
              {category}
            </span>
          )) : (
            <span
              className="px-3 py-1 text-xs rounded-full bg-opacity-20"
              style={{
                backgroundColor: getCategoryColor(categories).bg,
                color: getCategoryColor(categories).text
              }}
            >
              {categories}
            </span>
          )}
        </div>
        <div className="flex items-start gap-3">
          <h3 className="text-lg font-semibold text-white line-clamp-3 overflow-hidden">{title}</h3>
        </div>
      </div>
    </div>
  </div>
);

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    noteService.getActiveNotes()
      .then((data) => {
        if (mounted) setNotes(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (mounted) setError(e.message || 'Failed to load notes');
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notes</h1>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="text-gray-400">Loading notes...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-10">
            {notes.map((note) => (
              <NoteCard
                key={note.noteId || note.id}
                title={note.title}
                categories={(note.tags || []).map(t => t.name)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotesPage;