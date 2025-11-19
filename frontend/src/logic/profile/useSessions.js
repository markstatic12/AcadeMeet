import { useState, useEffect } from 'react';

const TRASH_TTL_DAYS = 14;

const pruneTrashed = (items) => {
  const now = Date.now();
  const kept = items.filter(s => !s.deletedAt || (now - s.deletedAt) < TRASH_TTL_DAYS * 24 * 60 * 60 * 1000);
  if (kept.length !== items.length) {
    localStorage.setItem('trashedSessions', JSON.stringify(kept));
  }
  return kept;
};

export const useSessions = (userId) => {
  const [sessionsData, setSessionsData] = useState([]);
  const [trashedSessions, setTrashedSessions] = useState([]);

  // Fetch sessions from API
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/sessions/user/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        if (!res.ok) throw new Error("Failed to fetch sessions");

        const data = await res.json();
        console.log("Fetched sessions:", data);
        setSessionsData(data);
        
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    if (userId) {
      fetchSessions();
    }
  }, [userId]);

  // Load trashed sessions from localStorage
  useEffect(() => {
    try {
      const trashed = JSON.parse(localStorage.getItem('trashedSessions') || '[]');
      setTrashedSessions(pruneTrashed(trashed));
    } catch (e) {
      console.error('Failed to load sessions from localStorage', e);
    }
  }, []);

  // Move session to trash
  const deleteSession = (sessionId) => {
    const toDelete = sessionsData.find(s => s.id === sessionId);
    if (!toDelete) return;
    const updated = sessionsData.filter(s => s.id !== sessionId);
    setSessionsData(updated);
    localStorage.setItem('sessions', JSON.stringify(updated));

    const newTrashItem = { ...toDelete, deletedAt: Date.now() };
    const currentTrash = pruneTrashed(JSON.parse(localStorage.getItem('trashedSessions') || '[]'));
    const nextTrash = [newTrashItem, ...currentTrash];
    setTrashedSessions(nextTrash);
    localStorage.setItem('trashedSessions', JSON.stringify(nextTrash));
  };

  // Restore a trashed session back to active sessions
  const restoreSession = (sessionId) => {
    const idx = trashedSessions.findIndex(s => s.id === sessionId);
    if (idx === -1) return;
    const restored = { ...trashedSessions[idx] };
    delete restored.deletedAt;
    const nextTrash = [...trashedSessions];
    nextTrash.splice(idx, 1);
    const nextSessions = [restored, ...sessionsData];
    setTrashedSessions(nextTrash);
    setSessionsData(nextSessions);
    localStorage.setItem('trashedSessions', JSON.stringify(nextTrash));
    localStorage.setItem('sessions', JSON.stringify(nextSessions));
  };

  return {
    sessionsData,
    trashedSessions,
    deleteSession,
    restoreSession,
    TRASH_TTL_DAYS
  };
};
