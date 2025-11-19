import React from 'react';

const FormField = ({ label, type = 'text', value, onChange, placeholder, required = false, rows }) => {
  const isTextarea = type === 'textarea';
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </label>
      {isTextarea ? (
        <textarea
          rows={rows || 4}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default FormField;
