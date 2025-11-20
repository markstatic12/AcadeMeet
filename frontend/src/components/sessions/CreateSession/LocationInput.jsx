import React from 'react';

const LocationInput = ({ value, onChange }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        name="location"
        value={value}
        onChange={onChange}
        placeholder="Enter Location"
        className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
      />
    </div>
  );
};

export default LocationInput;
