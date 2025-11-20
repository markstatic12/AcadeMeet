import React from 'react';
import { UserCircle, PencilIcon } from '../../icons/icons';

const ProfilePictureUpload = ({ preview, inputRef, onChange }) => {
  return (
    <div>
      <p className="text-gray-300 font-semibold mb-2">Profile Picture</p>
      <div className="relative w-56 h-56">
        <div className="absolute inset-4 bg-[#262626] rounded-full overflow-hidden flex items-center justify-center">
          {preview ? (
            <img src={preview} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <UserCircle className="w-24 h-24 text-gray-500" />
          )}
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          title="Edit profile picture"
          className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg ring-1 ring-white/20 flex items-center justify-center"
        >
          <PencilIcon className="w-4 h-4" />
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

export default ProfilePictureUpload;
