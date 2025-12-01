import React from 'react';

const LoadingState = ({ message = 'Loading...' }) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-400">{message}</p>
    </div>
  );
};

export default LoadingState;
