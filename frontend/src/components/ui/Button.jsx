import React from 'react';

const Button = ({ type = 'button', children }) => {
  return (
    <button
      type={type}
      className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
    >
      {children}
    </button>
  );
};

export default Button;