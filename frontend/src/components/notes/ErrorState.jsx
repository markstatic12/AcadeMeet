import React from 'react';

const ErrorState = ({ error }) => {
  return (
    <div className="text-red-400">{error}</div>
  );
};

export default ErrorState;
