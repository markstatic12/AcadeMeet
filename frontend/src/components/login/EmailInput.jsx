import React from 'react';

const EmailInput = ({ value, onChange }) => {
  return (
    <div className="space-y-1.5">
      <label htmlFor="email" className="block text-sm font-semibold text-gray-300">
        Email Address
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" 
            />
          </svg>
        </div>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={value}
          onChange={onChange}
          className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10 [&:-webkit-autofill]:bg-white/5 [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_rgba(255,255,255,0.05)_inset]"
          required
        />
      </div>
    </div>
  );
};

export default EmailInput;
