import React from 'react';

export const Divider = ({ className = '', orientation = 'horizontal', text }) => {
  if (orientation === 'vertical') {
    return <div className={`w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent ${className}`} />;
  }

  if (text) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-gray-700" />
        <span className="text-sm text-gray-500 font-medium">{text}</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-700 to-gray-700" />
      </div>
    );
  }

  return (
    <div className={`h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent ${className}`} />
  );
};
