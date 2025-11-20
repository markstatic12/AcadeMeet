import React from 'react';

const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#1a1a2e] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;