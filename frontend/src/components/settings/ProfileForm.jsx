import React from 'react';
import FormField from './FormField';
import ProfilePictureUpload from './ProfilePictureUpload';
import CoverImageUpload from './CoverImageUpload';

const ProfileForm = ({
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
            label="University"
            value={form.school}
            onChange={(e) => onFormChange('school', e.target.value)}
            placeholder="Your university"
          />
          
          <FormField
            label="Program"
            value={form.program}
            onChange={(e) => onFormChange('program', e.target.value)}
            placeholder="Your program"
          />
          
          <FormField
            label="School ID"
            value={form.studentId}
            onChange={(e) => onFormChange('studentId', e.target.value)}
            placeholder="ID number"
          />
          
          <FormField
            label="Phone Number"
            value={form.phone}
            onChange={(e) => onFormChange('phone', e.target.value)}
            placeholder="Add a phone number"
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

export default ProfileForm;
