import React from 'react';

const FormSelect = ({ 
  id, 
  name, 
  label, 
  value, 
  onChange, 
  options,
  icon,
  required = true 
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-semibold text-gray-300">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10 appearance-none cursor-pointer"
          required={required}
        >
          <option value="" className="bg-gray-800">Select</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-gray-800">
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FormSelect;
