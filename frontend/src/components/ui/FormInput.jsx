import React from 'react';

const FormInput = ({ 
  id, 
  name, 
  type, 
  label, 
  placeholder, 
  value, 
  onChange, 
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
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-white/10 [&:-webkit-autofill]:bg-white/5 [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_rgba(255,255,255,0.05)_inset]"
          required={required}
        />
      </div>
    </div>
  );
};

export default FormInput;
