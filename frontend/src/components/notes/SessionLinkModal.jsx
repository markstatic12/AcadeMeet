import React, { useState, useEffect } from 'react';
import { sessionService } from '../../services/SessionService';

const SessionLinkModal = ({ onClose, onSelectSession }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const sessionsData = await sessionService.getSessionsForLinking();
      setSessions(sessionsData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectSession = (session) => {
    onSelectSession(session);
  };

  const formatSessionTime = (dateTime) => {
    try {
      return new Date(dateTime).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date TBD';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Link to Session</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full"></div>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>{searchTerm ? 'No sessions found matching your search.' : 'No sessions available to link.'}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session)}
                  className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">{session.title}</h4>
                      {session.description && (
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                          {session.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>📅 {formatSessionTime(session.dateTime)}</span>
                        <span>📍 {session.location || 'Online'}</span>
                        {session.sessionType === 'PRIVATE' && (
                          <span className="bg-red-900/50 text-red-300 px-2 py-1 rounded">
                            Private
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-gray-400 text-sm">
            Select a session to insert a link in your note.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionLinkModal;