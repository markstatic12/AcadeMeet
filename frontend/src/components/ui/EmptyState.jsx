import React from 'react';

const EmptyState = ({ message = 'No items found.' }) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-400">{message}</p>
    </div>
  );
};

export default EmptyState;
