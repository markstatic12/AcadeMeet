import React, { useState } from 'react';
import { UserCircle, PencilIcon, EditIcon } from '../../icons';



// ===== FORM FIELD =====

export const FormField = ({ label, type = 'text', value, onChange, placeholder, required = false, rows, showEditIcon = true }) => {
  const isTextarea = type === 'textarea';
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
        {label}
        {required && <span className="text-red-400"> *</span>}
        {showEditIcon && <EditIcon className="w-3.5 h-3.5 text-gray-500" />}
      </label>
      {isTextarea ? (
        <textarea
          rows={rows || 4}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder={placeholder}
        />
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

const ProfileForm = ({
  form,
  onFormChange,
  saving,
  hasChanges,
  onCancel,
  onSave,
  profilePreview,
  coverPreview,
  profileInputRef,
  coverInputRef,
  onProfileImageChange,
  onCoverImageChange,
}) => {
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
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              Program
              <EditIcon className="w-3.5 h-3.5 text-gray-500" />
            </label>
            <select
              value={form.program || ''}
              onChange={(e) => onFormChange('program', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer transition-all hover:border-gray-600"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              <option value="" disabled className="bg-gray-800 text-gray-400">Select program</option>
              <option value="BSCS" className="bg-gray-800 text-white hover:bg-indigo-600">BSCS</option>
              <option value="BSIT" className="bg-gray-800 text-white hover:bg-indigo-600">BSIT</option>
              <option value="BSCE" className="bg-gray-800 text-white hover:bg-indigo-600">BSCE</option>
              <option value="BSCPE" className="bg-gray-800 text-white hover:bg-indigo-600">BSCpE</option>
              <option value="BSEE" className="bg-gray-800 text-white hover:bg-indigo-600">BSEE</option>
              <option value="BSME" className="bg-gray-800 text-white hover:bg-indigo-600">BSME</option>
              <option value="BSA" className="bg-gray-800 text-white hover:bg-indigo-600">BSA</option>
              <option value="BSBA" className="bg-gray-800 text-white hover:bg-indigo-600">BSBA</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              Year Level
              <EditIcon className="w-3.5 h-3.5 text-gray-500" />
            </label>
            <select
              value={form.yearLevel || ''}
              onChange={(e) => onFormChange('yearLevel', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer transition-all hover:border-gray-600"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              <option value="" disabled className="bg-gray-800 text-gray-400">Select year level</option>
              <option value="1" className="bg-gray-800 text-white hover:bg-indigo-600">1st Year</option>
              <option value="2" className="bg-gray-800 text-white hover:bg-indigo-600">2nd Year</option>
              <option value="3" className="bg-gray-800 text-white hover:bg-indigo-600">3rd Year</option>
              <option value="4" className="bg-gray-800 text-white hover:bg-indigo-600">4th Year</option>
            </select>
          </div>

          
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
              disabled={saving || !hasChanges}
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              disabled={saving || !hasChanges}
              onClick={onSave}
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ProfileForm;