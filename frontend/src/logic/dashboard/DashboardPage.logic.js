import { useState, useEffect } from 'react';
import { noteService } from '../../services/noteService';
import { useUser } from '../../context/UserContext';

export const useDashboardPage = () => {
  const { getUserId } = useUser();
  const [activeSessionTab, setActiveSessionTab] = useState('available');
  const [activeNotesTab, setActiveNotesTab] = useState('my');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState(null);

  // Load user's notes when the Notes tab is active
  useEffect(() => {
    let cancelled = false;
    
    const loadNotes = async () => {
      if (activeNotesTab !== 'my') return;
      
      const userId = getUserId();
      if (!userId) return;
      
      setNotesLoading(true);
      setNotesError(null);
      
      try {
        const data = await noteService.getUserActiveNotes(userId);
        if (cancelled) return;
        
        const normalized = (Array.isArray(data) ? data : []).map((n) => ({
          id: n.noteId || n.id || n.note_id || Math.random(),
          title: n.title || 'Untitled Note',
          createdAt: n.createdAt || n.created_at || n.createdDate || '',
          date: n.createdAt 
            ? `Created on ${new Date(n.createdAt).toLocaleDateString()}` 
            : (n.date || ''),
          icon: '📄',
          iconBg: 'bg-blue-500',
        }));
        
        setNotes(normalized);
      } catch (err) {
        setNotes([]);
        setNotesError(err.message || 'Failed to load notes');
      } finally {
        if (!cancelled) setNotesLoading(false);
      }
    };

    loadNotes();
    return () => { cancelled = true; };
  }, [activeNotesTab, getUserId]);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return {
    activeSessionTab,
    setActiveSessionTab,
    activeNotesTab,
    setActiveNotesTab,
    currentMonth,
    goToPreviousMonth,
    goToNextMonth,
    notes,
    notesLoading,
    notesError
  };
};
