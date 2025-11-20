import React from 'react';
import NoteCard from './NoteCard';
import { useNavigate } from 'react-router-dom';
import createNewCard from '../profile/CreateNewCard';
import CreateNewCard from '../profile/CreateNewCard';


const NotesGrid = ({ notes }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-10">
      
      <CreateNewCard
        onClick={() => navigate('/notes/new')}
        label="Create New Note"
      />  

      {notes.map((note) => (
        <NoteCard
          key={note.noteId || note.id}
          title={note.title}
          categories={(note.tags || []).map(t => t.name)}
        />
      ))}
    </div>
  );
};

export default NotesGrid;
