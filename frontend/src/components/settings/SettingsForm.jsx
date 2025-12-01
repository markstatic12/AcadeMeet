import React, { useState } from 'react';
import { UserCircle, PencilIcon } from '../../icons';



// ===== FORM FIELD =====

export const FormField = ({ label, type = 'text', value, onChange, placeholder, required = false, rows, options }) => {
  const isTextarea = type === 'textarea';
  const isSelect = type === 'select';
  
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
      ) : isSelect ? (
        <select
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
        >
          <option value="">Select</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value} className="bg-gray-800">
              {option.label}
            </option>
          ))}
        </select>
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


// ===== PROFILE PICTURE UPLOAD =====

export const ProfilePictureUpload = ({ preview, inputRef, onChange }) => {
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


// ===== COVER IMAGE UPLOAD =====

export const CoverImageUpload = ({ preview, inputRef, onChange }) => {
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

// ===== PROFILE FORM =====

export const ProfileForm = ({
  form,
  onFormChange,
  saving,
  onCancel,
  onSave,
  profilePreview,
  coverPreview,
  profileInputRef,
  coverInputRef,
  onProfileImageChange,
  onCoverImageChange,
}) => {
  const YEAR_LEVEL_OPTIONS = [
    { value: '1', label: '1st Year' },
    { value: '2', label: '2nd Year' },
    { value: '3', label: '3rd Year' },
    { value: '4', label: '4th Year' },
  ];
  
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Public Profile</h3>
      </div>
      <div className="h-px w-full bg-gray-700 my-4" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Form fields */}
        <div className="space-y-5">
          <FormField
            label="Name"
            value={form.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            placeholder="Your name"
          />
          
          
          <FormField
            label="Program"
            value={form.program}
            onChange={(e) => onFormChange('program', e.target.value)}
            placeholder="Your program"
          />
          
          {/* Year Level - same UI as Program field */}
          <FormField
            label="Year Level"
            type="select"
            value={form.yearLevel ?? ''}
            onChange={(e) => onFormChange('yearLevel', e.target.value)}
            options={YEAR_LEVEL_OPTIONS}
          />
          
          
          <FormField
            label="Bio"
            type="textarea"
            rows={4}
            value={form.bio}
            onChange={(e) => onFormChange('bio', e.target.value)}
            placeholder="Tell us something about yourself..."
          />
          
          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              disabled={saving}
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              onClick={onSave}
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Right column - Avatar and cover */}
        <div className="space-y-6">
          <ProfilePictureUpload
            preview={profilePreview}
            inputRef={profileInputRef}
            onChange={onProfileImageChange}
          />
          
          <CoverImageUpload
            preview={coverPreview}
            inputRef={coverInputRef}
            onChange={onCoverImageChange}
          />
        </div>
      </div>
    </>
  );
};

// ===== PASSWORD RESET CARD =====

export default ProfileForm;