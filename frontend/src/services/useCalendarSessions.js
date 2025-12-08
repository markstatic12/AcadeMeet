import { useState, useEffect, useCallback } from 'react';
import { sessionService } from './SessionService';

export const useCalendarSessions = (currentMonth) => {
  const [sessionsMap, setSessionsMap] = useState({}); // Maps "YYYY-MM-DD" to sessions array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMonthSessions = useCallback(async () => {
    if (!currentMonth) return;

    setLoading(true);
    setError(null);

    try {
      // Get all sessions for the user
      const allSessions = await sessionService.getAllSessions();
      
      // Filter sessions for the current month
      const year = currentMonth.getFullYear().toString();
      const monthName = currentMonth.toLocaleString('default', { month: 'long' });
      
      const monthSessions = allSessions.filter(session => 
        session.year === year && session.month?.toUpperCase() === monthName.toUpperCase()
      );

      // Group sessions by day
      const newSessionsMap = {};
      monthSessions.forEach(session => {
        const dayKey = `${year}-${monthName}-${session.day}`;
        if (!newSessionsMap[dayKey]) {
          newSessionsMap[dayKey] = [];
        }
        newSessionsMap[dayKey].push(session);
      });

      setSessionsMap(newSessionsMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchMonthSessions();
  }, [fetchMonthSessions]);

  const getSessionsForDay = useCallback((day) => {
    if (!currentMonth) return [];
    
    const year = currentMonth.getFullYear().toString();
    const monthName = currentMonth.toLocaleString('default', { month: 'long' });
    const dayKey = `${year}-${monthName}-${day}`;
    
    return sessionsMap[dayKey] || [];
  }, [currentMonth, sessionsMap]);

  const hasSessionsOnDay = useCallback((day) => {
    return getSessionsForDay(day).length > 0;
  }, [getSessionsForDay]);

  return {
    sessionsMap,
    loading,
    error,
    getSessionsForDay,
    hasSessionsOnDay,
    refreshSessions: fetchMonthSessions
  };
};