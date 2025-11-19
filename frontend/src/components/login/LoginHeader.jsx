import React from 'react';
import logo from '../../assets/academeet-white.svg';

const LoginHeader = () => {
  return (
    <div className="mb-8 animate-slideDown">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative group">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/40 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
            <img 
              src={logo} 
              alt="AcadeMeet Logo" 
              className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105" 
            />
          </div>
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 group-hover:ring-white/30 transition-all duration-300"></div>
        </div>
        <div>
          <span className="text-xl font-bold text-white tracking-tight">
            Acade<span className="text-indigo-400">Meet</span>
          </span>
          <p className="text-xs text-gray-500">Study Together, Learn Forever</p>
        </div>
      </div>
      
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-sm">
          Sign in to continue your learning journey
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;
