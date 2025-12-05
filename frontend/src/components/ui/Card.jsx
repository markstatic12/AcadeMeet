import React from 'react';

export const Card = ({ children, className = '', variant = 'default', padding = 'default' }) => {
  const variants = {
    default: 'bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10',
    elevated: 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 shadow-2xl shadow-black/20 transition-all hover:border-indigo-500/40 hover:shadow-indigo-500/20',
    glass: 'bg-gray-900/40 backdrop-blur-xl border border-gray-700/30 transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10',
    solid: 'bg-gray-900 border border-gray-800 transition-all hover:border-gray-700 hover:shadow-lg hover:shadow-indigo-500/10',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-5',
  };

  return (
    <div className={`rounded-2xl ${variants[variant]} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`mb-3 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', icon }) => {
  return (
    <h3 className={`text-lg font-bold text-white flex items-center gap-2 ${className}`}>
      {icon && <span className="text-indigo-400">{icon}</span>}
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '' }) => {
  return (
    <p className={`text-xs text-gray-400 mt-1 ${className}`}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-700/50 ${className}`}>
      {children}
    </div>
  );
};
