import React from 'react';
import { UserCircle, PencilIcon, ImageIcon, SparklesIcon } from '../../icons';

export const ProfileImageUpload = ({ preview, inputRef, onChange }) => {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
          Profile Picture
        </label>
        {preview && (
          <span className="text-[10px] text-gray-500 flex items-center gap-1">
            <SparklesIcon className="w-2.5 h-2.5" />
            Looking good!
          </span>
        )}
      </div>
      
      <div className="relative w-full aspect-square max-w-[140px] mx-auto">
        {/* Decorative rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-lg group-hover:blur-xl transition-all duration-300" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-600/10 to-transparent animate-pulse" />
        
        {/* Image container */}
        <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700/50 group-hover:border-indigo-500/50 transition-all duration-300 shadow-xl">
          {preview ? (
            <img src={preview} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UserCircle className="w-16 h-16 text-gray-600" />
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-center">
              <PencilIcon className="w-5 h-5 text-white mx-auto mb-1" />
              <span className="text-xs text-white font-medium">Change Photo</span>
            </div>
          </div>
        </div>
        
        {/* Edit button */}
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/50 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-10"
          title="Change profile picture"
        >
          <PencilIcon className="w-3.5 h-3.5" />
        </button>
        
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </div>
      
      <p className="text-[10px] text-center text-gray-500 mt-2">
        Recommended: Square image, at least 400x400px
      </p>
    </div>
  );
};

export const CoverImageUpload = ({ preview, inputRef, onChange }) => {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
          Cover Image
        </label>
        {preview && (
          <span className="text-[10px] text-gray-500 flex items-center gap-1">
            <SparklesIcon className="w-2.5 h-2.5" />
            Excellent choice!
          </span>
        )}
      </div>
      
      <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 group-hover:border-indigo-500/50 transition-all duration-300 shadow-lg">
        {preview ? (
          <img src={preview} alt="cover" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-indigo-900/50" />
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center">
            <PencilIcon className="w-4 h-4 text-white mx-auto mb-1" />
            <span className="text-xs text-white font-medium">Change Cover</span>
          </div>
        </div>
        
        {/* Edit button */}
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-lg shadow-indigo-500/50 flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <PencilIcon className="w-3 h-3" />
          Edit Cover
        </button>
        
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </div>
      
      <p className="text-[10px] text-center text-gray-500 mt-1.5">
        Recommended: 1200x400px for best results
      </p>
    </div>
  );
};
