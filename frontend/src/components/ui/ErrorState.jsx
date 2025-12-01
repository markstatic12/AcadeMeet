import React from 'react';

const ErrorState = ({ message = 'An error occurred.' }) => {
  return (
    <div className="text-center py-12">
      <p className="text-red-500">{message}</p>
    </div>
  );
};

export default ErrorState;
