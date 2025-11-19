import React from 'react';

const AlertMessage = ({ type, message }) => {
  const isError = type === 'error';
  
  const colorClasses = isError
    ? 'bg-red-500/10 border-red-500/50 text-red-400'
    : 'bg-green-500/10 border-green-500/50 text-green-400';
  
  const animationClass = isError ? 'animate-shake' : 'animate-slideDown';
  
  const icon = isError ? (
    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );

  if (!message) return null;

  return (
    <div className={`${colorClasses} backdrop-blur-sm border px-3 py-2.5 rounded-xl mb-3 text-xs ${animationClass} flex items-start gap-2`}>
      {icon}
      <span>{message}</span>
    </div>
  );
};

export default AlertMessage;
