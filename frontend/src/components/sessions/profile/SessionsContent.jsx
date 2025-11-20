import React from 'react';
import CreateNewCard from './CreateNewCard';
import SessionCard from './SessionCard';

const SessionsContent = ({ sessionsData, openCardMenuId, onCreateSession, onMenuToggle, onDeleteSession }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full flex-1 overflow-y-auto pr-1 custom-scrollbar">
      {/* Create New Session Card */}
      <CreateNewCard onClick={onCreateSession} label="Create New Session" />

      {/* Session Cards */}
      {sessionsData.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          openMenuId={openCardMenuId}
          onMenuToggle={onMenuToggle}
          onDelete={onDeleteSession}
        />
      ))}
    </div>
  );
};

export default SessionsContent;
