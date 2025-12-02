import React, { forwardRef } from 'react';

// Base Input Component
export const Input = forwardRef(({ className = '', error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full px-3 py-2 text-sm bg-gray-800/50 border ${
        error ? 'border-red-500' : 'border-gray-700'
      } rounded-lg text-white placeholder-gray-400 
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
      hover:border-gray-600 transition-all duration-200 ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

// Textarea Component
export const Textarea = forwardRef(({ className = '', error, rows = 4, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`w-full px-3 py-2 text-sm bg-gray-800/50 border ${
        error ? 'border-red-500' : 'border-gray-700'
      } rounded-lg text-white placeholder-gray-400 
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
      hover:border-gray-600 transition-all duration-200 resize-none ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

// Select Component
export const Select = forwardRef(({ className = '', error, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`w-full px-3 py-2 text-sm bg-gray-800/50 border ${
        error ? 'border-red-500' : 'border-gray-700'
      } rounded-lg text-white 
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
      hover:border-indigo-600 transition-all duration-200 cursor-pointer
      [&>option]:bg-gray-800 [&>option:checked]:bg-indigo-600 [&>option:hover]:bg-indigo-700 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';

export default Input;