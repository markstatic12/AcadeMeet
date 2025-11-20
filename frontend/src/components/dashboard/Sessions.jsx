import React, { useState, useEffect } from 'react';
import { SlCalender } from "react-icons/sl";
import { IoTimeOutline } from "react-icons/io5";
import { GrVideo } from "react-icons/gr";
import { formatDate, formatTime } from '../../utils/dateTimeUtils';

// Session Card Component
const SessionCard = ({ session }) => {
  return (
    <div className="bg-[#1e1e1e] rounded-xl p-5 flex flex-col gap-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-white truncate">
        {session.title}
      </h3>
      
      <div className="flex items-center gap-3 text-gray-400 text-sm">
        <SlCalender className="flex-shrink-0" />
        <span>{formatDate(session.month, session.day, session.year)}</span>
      </div>
      
      <div className="flex items-center gap-3 text-gray-400 text-sm">
        <IoTimeOutline className="flex-shrink-0" />
        <span>
          {formatTime(session.startTime)} - {formatTime(session.endTime)}
        </span>
      </div>
      
      <div className="flex items-center gap-3 text-gray-400 text-sm">
        <GrVideo className="flex-shrink-0" />
        <span className="truncate">{session.location}</span>
      </div>
    </div>
  );
};

// Sessions Section Component
const SessionsSection = () => {
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
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};

export { SessionCard, SessionsSection };
export default SessionsSection;
