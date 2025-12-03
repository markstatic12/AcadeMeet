import React, { useState, useEffect, useCallback } from 'react';
import { CloseIcon } from '../../icons';
import { sessionService } from '../../services/SessionService';
import { SessionCard } from '../sessions/Sessions';

const DaySessionsModal = ({ isOpen, onClose, selectedDate }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSessionsForDate = useCallback(async () => {
    if (!selectedDate) return;

    setLoading(true);
    setError(null);
    
    try {
      const { year, month, day } = selectedDate;
      const sessionsData = await sessionService.getSessionsByDate(year, month, day);
      setSessions(sessionsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (isOpen && selectedDate) {
      fetchSessionsForDate();
    }
  }, [isOpen, selectedDate, fetchSessionsForDate]);

  const formatDateString = () => {
    if (!selectedDate) return '';
    const { year, month, day } = selectedDate;
    return `${month} ${day}, ${year}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-6 w-[80vw] h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Sessions for {formatDateString()}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <CloseIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-3">
            <p className="text-red-400 text-sm">Error: {error}</p>
          </div>
        )}

        {!loading && !error && sessions.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-base mb-1">No Sessions</div>
            <p className="text-gray-500 text-sm">No sessions scheduled for this date.</p>
          </div>
        )}

        {!loading && !error && sessions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DaySessionsModal;