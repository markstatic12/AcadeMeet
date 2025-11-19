import React from 'react';
import SessionCard from './SessionCard';

const SessionsGrid = ({ sessions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {sessions.map(session => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
};

export default SessionsGrid;
