import React from 'react';

const FormOptions = () => {
  return (
    <div className="flex items-center justify-between text-sm pt-1">
      <label className="flex items-center gap-2 cursor-pointer group">
        <input 
          type="checkbox" 
          className="w-4 h-4 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0 bg-white/5" 
        />
        <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
          Remember me
        </span>
      </label>
      <a 
        href="#" 
        className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
      >
        Forgot password?
      </a>
    </div>
  );
};

export default FormOptions;
