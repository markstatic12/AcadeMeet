import React from 'react';
import TrashedSessionCard from './TrashedSessionCard';

const TrashedSessionsContent = ({ trashedSessions, TRASH_TTL_DAYS, onRestore, onBackToSessions }) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-white text-xl font-bold">Trashed Sessions</h3>
        <button
          onClick={onBackToSessions}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm"
        >
          Back to Sessions
        </button>
      </div>
      {trashedSessions.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-gray-700 rounded-2xl p-10 text-center text-gray-400">
          No trashed sessions. Deleted sessions stay here for 14 days.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {trashedSessions.map((session) => {
            const msLeft = session.deletedAt
              ? session.deletedAt + TRASH_TTL_DAYS * 24 * 60 * 60 * 1000 - Date.now()
              : 0;
            const daysLeft = Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
            return (
              <TrashedSessionCard
                key={session.id}
                session={session}
                daysLeft={daysLeft}
                onRestore={onRestore}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrashedSessionsContent;
