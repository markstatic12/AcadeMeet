import React from 'react';

const NoteTitleInput = ({ value, onChange }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        name="title"
        value={value}
        onChange={onChange}
        placeholder="Untitled Note"
        className="w-full bg-transparent text-4xl font-bold text-indigo-300 placeholder-indigo-300/50 focus:outline-none focus:text-white transition-colors"
      />
    </div>
  );
};

export default NoteTitleInput;
