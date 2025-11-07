import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const NoteCard = ({ title, category, icon }) => (
  <div className="bg-[#1f1f1f] rounded-xl p-6 hover:bg-[#2a2a2a] transition-all duration-300 cursor-pointer group">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{icon}</span>
          <span className="px-3 py-1 text-xs rounded-full bg-opacity-20" 
                style={{ 
                  backgroundColor: category === 'Springboot' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(33, 150, 243, 0.2)',
                  color: category === 'Springboot' ? '#4CAF50' : '#2196F3'
                }}>
            {category}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      </div>
    </div>
  </div>
);

const NotesPage = () => {
  const notes = [
    {
      id: 1,
      title: 'Introduction to SpringBoot',
      category: 'Springboot',
      icon: '🍃'
    },
    {
      id: 2,
      title: 'Data Visualization',
      category: 'Excel',
      icon: '📊'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notes</h1>
          <p className="text-gray-400">Access and manage your study materials</p>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              title={note.title}
              category={note.category}
              icon={note.icon}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotesPage;