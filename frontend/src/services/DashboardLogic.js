// Dashboard Service
import { useState, useEffect } from 'react';
import { noteService } from './NoteService';
import { useUser } from '../context/UserContext';

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
        
        setNotes(data);
        console.log('Dashboard loaded user notes:', data);
      } catch (err) {
        if (cancelled) return;
        
        console.error('Failed to load user notes:', err);
        setNotesError(err.message || 'Failed to load notes');
      } finally {
        if (!cancelled) {
          setNotesLoading(false);
        }
      }
    };

    loadNotes();
    
    return () => {
      cancelled = true;
    };
  }, [activeNotesTab, getUserId]);

  // Load all notes when the All Notes tab is active
  useEffect(() => {
    let cancelled = false;
    
    const loadAllNotes = async () => {
      if (activeNotesTab !== 'all') return;
      
      setNotesLoading(true);
      setNotesError(null);
      
      try {
        const data = await noteService.getAllActiveNotes();
        if (cancelled) return;
        
        setNotes(data);
        console.log('Dashboard loaded all notes:', data);
      } catch (err) {
        if (cancelled) return;
        
        console.error('Failed to load all notes:', err);
        setNotesError(err.message || 'Failed to load notes');
      } finally {
        if (!cancelled) {
          setNotesLoading(false);
        }
      }
    };

    loadAllNotes();
    
    return () => {
      cancelled = true;
    };
  }, [activeNotesTab]);

  const handleSessionTabChange = (tab) => {
    setActiveSessionTab(tab);
  };

  const handleNotesTabChange = (tab) => {
    setActiveNotesTab(tab);
  };

  const handleMonthChange = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'next') {
        newMonth.setMonth(prev.getMonth() + 1);
      } else {
        newMonth.setMonth(prev.getMonth() - 1);
      }
      return newMonth;
    });
  };

  return {
    activeSessionTab,
    activeNotesTab,
    currentMonth,
    notes,
    notesLoading,
    notesError,
    handleSessionTabChange,
    handleNotesTabChange,
    handleMonthChange
  };
};