import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-gray-800 text-gray-300 border border-gray-700',
    primary: 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30',
    success: 'bg-green-600/20 text-green-300 border border-green-500/30',
    warning: 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30',
    danger: 'bg-red-600/20 text-red-300 border border-red-500/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
