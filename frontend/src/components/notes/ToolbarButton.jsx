import React from 'react';

const ToolbarButton = ({ label, icon, onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors text-sm ${className}`}
    title={label || 'format'}
  >
    {icon || label}
  </button>
);

export default ToolbarButton;
