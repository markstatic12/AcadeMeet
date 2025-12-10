import { useState, useEffect } from 'react';

export const useDashboardPage = () => {
  const [activeSessionTab, setActiveSessionTab] = useState('available');
  const [activeNotesTab, setActiveNotesTab] = useState('my');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState(null);

  useEffect(() => {
    const loadNotes = async () => {
      if (activeNotesTab !== 'my') return;
      
      setNotesLoading(false);
      setNotes([]);
      setNotesError('Notes feature coming soon');
    };

    loadNotes();
  }, [activeNotesTab]);

  // Load all notes when the All Notes tab is active
  useEffect(() => {
    const loadAllNotes = async () => {
      if (activeNotesTab !== 'all') return;
      
      setNotesLoading(false);
      setNotes([]);
      setNotesError('Notes feature coming soon');
    };

    loadAllNotes();
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

  const goToPreviousMonth = () => handleMonthChange('prev');
  const goToNextMonth = () => handleMonthChange('next');

  return {
    activeSessionTab,
    setActiveSessionTab,
    activeNotesTab,
    setActiveNotesTab,
    currentMonth,
    notes,
    notesLoading,
    notesError,
    handleSessionTabChange,
    handleNotesTabChange,
    handleMonthChange,
    goToPreviousMonth,
    goToNextMonth
  };
};