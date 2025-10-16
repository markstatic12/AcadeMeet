import React from 'react';

const Input = ({ id, name, type = 'text', placeholder, value, onChange }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {placeholder}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  );
};

export default Input;