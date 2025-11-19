import React from 'react';
import { Link } from 'react-router-dom';

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

export default NotesEmptyState;
