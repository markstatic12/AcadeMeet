import React from 'react';

const ErrorState = ({ message }) => {
  return (
    <div className="text-center py-12">
      <p className="text-red-500">{message}</p>
    </div>
  );
};

export default ErrorState;
