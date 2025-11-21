import React from 'react';

const SessionTitleInput = ({ value, onChange }) => {
  return (
    <div className="flex-1">
      <input
        type="text"
        name="title"
        value={value}
        onChange={onChange}
        placeholder="Enter Meeting Name"
        className="w-full bg-transparent text-4xl font-bold text-indigo-300 placeholder-indigo-300/50 focus:outline-none focus:text-white transition-colors"
      />
    </div>
  );
};

export default SessionTitleInput;
