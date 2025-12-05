import { useState, useEffect } from 'react';
import { noteService } from '../services/noteService';
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Hook for CreateNotePage - DEPRECATED
 * Manual note creation has been removed. Notes are now only created via:
 * 1. Drag-and-drop file upload
 * 2. Association with sessions during session creation
 * 
 * This hook is kept for backward compatibility but should not be used.
 * @deprecated
 */
/*
export const useCreateNotePage = () => {
  // ... (commented out for removal)
};
*/

export const useNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true; 
    setLoading(true);
    
    noteService.getAllActiveNotes()
      .then((data) => {
        if (mounted) setNotes(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (mounted) setError(e.message || 'Failed to load notes');
      })
      .finally(() => { 
        if (mounted) setLoading(false); 
      });
    
    return () => { mounted = false; };
  }, []);

  return {
    notes,
    loading,
    error
  };
};