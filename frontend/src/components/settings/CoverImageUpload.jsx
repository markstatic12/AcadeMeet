import React from 'react';
import { PencilIcon } from '../../icons';

const CoverImageUpload = ({ preview, inputRef, onChange }) => {
  return (
    <div>
      <p className="text-gray-300 font-semibold mb-2">Cover Image</p>
      <div className="relative w-full max-w-md h-28 rounded-xl overflow-hidden bg-[#262626]">
        {preview ? (
          <img src={preview} alt="cover" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-indigo-500 to-indigo-300" />
        )}
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-indigo-600 text-white text-xs flex items-center gap-1"
        >
          <PencilIcon className="w-3 h-3" /> Edit
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default CoverImageUpload;
