import { useState, useEffect } from 'react';
import { jwtUtils } from '../../utils/jwtUtils';

export const useSessions = (userId) => {
  const [sessionsData, setSessionsData] = useState([]);
  const [trashedSessions, setTrashedSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch current user's sessions from API
  useEffect(() => {
    const fetchSessions = async () => {
      if (!jwtUtils.hasToken()) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const res = await jwtUtils.fetchWithJWT(
          `http://localhost:8080/api/sessions/my-sessions`,
          { method: "GET" }
        );

        if (!res.ok) throw new Error("Failed to fetch sessions");

        const data = await res.json();
        console.log("Fetched sessions:", data);
        setSessionsData(data || []);
        
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError(err.message);
        setSessionsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Delete session via API
  const deleteSession = async (sessionId) => {
    try {
      const res = await jwtUtils.fetchWithJWT(
        `http://localhost:8080/api/sessions/${sessionId}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete session");

      // Remove from state
      setSessionsData(prevSessions => prevSessions.filter(s => s.id !== sessionId));
      console.log("Session deleted successfully");
    } catch (err) {
      console.error("Error deleting session:", err);
      setError(err.message);
    }
  };

  // Restore session via API (requires backend support)
  const restoreSession = async (sessionId) => {
    try {
      const res = await jwtUtils.fetchWithJWT(
        `http://localhost:8080/api/sessions/${sessionId}/restore`,
        { method: "PATCH" }
      );

      if (!res.ok) throw new Error("Failed to restore session");

      const restored = await res.json();
      // Add back to active sessions
      setSessionsData(prevSessions => [restored, ...prevSessions]);
      // Remove from trashed
      setTrashedSessions(prevTrashed => prevTrashed.filter(s => s.id !== sessionId));
      console.log("Session restored successfully");
    } catch (err) {
      console.error("Error restoring session:", err);
      setError(err.message);
    }
  };

  return {
    sessionsData,
    trashedSessions,
    isLoading,
    error,
    deleteSession,
    restoreSession
  };
};
