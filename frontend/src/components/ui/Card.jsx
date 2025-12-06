import React from 'react';

export const Card = ({ children, className = '', variant = 'default', padding = 'default' }) => {
  const variants = {
    default: 'bg-gradient-to-br from-[#1a1a2e]/90 via-[#16213e]/90 to-[#0f0f1e]/90 backdrop-blur-sm border border-indigo-900/30 transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20',
    elevated: 'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f1e] border border-indigo-900/40 shadow-2xl shadow-indigo-950/30 transition-all hover:border-indigo-500/60 hover:shadow-indigo-500/30',
    glass: 'bg-[#0f0f1e]/40 backdrop-blur-xl border border-indigo-900/20 transition-all hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/20',
    solid: 'bg-gradient-to-br from-[#16213e] to-[#0f0f1e] border border-indigo-900/30 transition-all hover:border-indigo-800/50 hover:shadow-lg hover:shadow-indigo-500/10',
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
