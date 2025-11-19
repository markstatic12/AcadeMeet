import React from 'react';
import PopularSessionCard from './PopularSessionCard';

const PopularSessionsSection = ({ sessions }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Popular Sessions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sessions.map((session) => (
          <PopularSessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
};

export default PopularSessionsSection;
