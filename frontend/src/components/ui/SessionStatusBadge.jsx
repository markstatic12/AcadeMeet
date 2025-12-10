import React from 'react';

const SessionStatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ACTIVE': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'COMPLETED': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'DELETED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyle()}`}>
      {status}
    </span>
  );
};

export default SessionStatusBadge;