import { useState, useEffect } from 'react';
import { noteService } from '../../services/noteService';

export const useNotes = (activeTab) => {
  const [notesData, setNotesData] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadNotes = async () => {
      try {
        const serverNotes = await noteService.getActiveNotes();
        if (!mounted) return;
        const normalized = (Array.isArray(serverNotes) ? serverNotes : []).map(n => ({
          id: n.id || n.noteId,
          title: n.title,
          content: n.content || n.richText || '',
          createdAt: n.createdAt || n.created_at || new Date().toISOString(),
          isFavourite: n.isFavourite || false,
          archivedAt: n.archivedAt || null,
          deletedAt: n.deletedAt || null
        }));
        setNotesData(normalized);
        localStorage.setItem('notes', JSON.stringify(normalized));
      } catch (err) {
        console.warn('Failed to load notes from server, falling back to localStorage', err);
        try {
          const storedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
          if (mounted) setNotesData(storedNotes);
        } catch (e) {
          console.error('Failed to load notes from localStorage', e);
        }
      }

      // Auto-switch to notes if coming from create-note
      if (sessionStorage.getItem('openNotesTab') === 'true') {
        sessionStorage.removeItem('openNotesTab');
      }
    };

    // Only fetch notes when the notes tab is active
    if (activeTab === 'notes') {
      loadNotes();
    }

    return () => { mounted = false; };
  }, [activeTab]);

  // Helper to persist notes changes
  const persistNotes = (next) => {
    setNotesData(next);
    localStorage.setItem('notes', JSON.stringify(next));
  };

  // Note actions
  const toggleFavouriteNote = (noteId) => {
    const next = notesData.map(n => n.id === noteId ? { ...n, isFavourite: !n.isFavourite } : n);
    persistNotes(next);
  };

  const archiveNote = (noteId) => {
    const next = notesData.map(n => n.id === noteId ? { ...n, archivedAt: n.archivedAt ? null : Date.now() } : n);
    persistNotes(next);
  };

  const deleteNote = (noteId) => {
    const next = notesData.map(n => n.id === noteId ? { ...n, deletedAt: Date.now() } : n);
    persistNotes(next);
  };

  // Restore trashed note
  const restoreTrashedNote = (noteId) => {
    const next = notesData.map(n => n.id === noteId ? { ...n, deletedAt: null } : n);
    persistNotes(next);
  };

  // Restore archived note
  const restoreArchivedNote = (noteId) => {
    const next = notesData.map(n => n.id === noteId ? { ...n, archivedAt: null } : n);
    persistNotes(next);
  };

  return {
    notesData,
    toggleFavouriteNote,
    archiveNote,
    deleteNote,
    restoreTrashedNote,
    restoreArchivedNote
  };
};
