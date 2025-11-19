import React from 'react';

const AuthorFooter = ({ userName }) => {
  if (!userName) return null;

  return (
    <p className="mt-4 text-xs text-gray-600">
      Author: {userName}
    </p>
  );
};

export default AuthorFooter;
