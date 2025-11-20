import React, { useState, useEffect } from 'react';
import PopularSessionCard from './PopularSessionCard';

const PopularSessionsSection = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/sessions/all-sessions');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Only display first 4 sessions on dashboard
      setSessions(Array.isArray(data) ? data.slice(0, 4) : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sessions. Please try again later.');
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Active Sessions</h2>
      {loading && <p className="text-white/60">Loading sessions...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && sessions.length === 0 && (
        <p className="text-white/60">No sessions available.</p>
      )}
      {!loading && sessions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sessions.map((session) => (
            <PopularSessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularSessionsSection;
