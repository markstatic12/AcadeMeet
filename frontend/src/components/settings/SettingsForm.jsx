import React from 'react';
import { EditIcon, UserIcon, AcademicCapIcon, CalendarIcon, DocumentTextIcon, SaveIcon, XIcon } from '../../icons';
import { Input, Textarea, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Divider } from '../ui/Divider';
import { ProfileImageUpload, CoverImageUpload } from './ImageUploadSection';





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
    <div className="space-y-4">
      {/* Header Card with Action Buttons */}
      <Card variant="glass" padding="default">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle icon={<UserIcon className="w-5 h-5" />}>
              Public Profile
            </CardTitle>
            <CardDescription>
              This information will be displayed on your profile and visible to other users
            </CardDescription>
          </div>
          <div className="flex gap-2.5 ml-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={onCancel}
              disabled={saving || !hasChanges}
              icon={XIcon}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onSave}
              disabled={saving || !hasChanges}
              loading={saving}
              icon={SaveIcon}
            >
              Save Changes
            </Button>
          </div>
        </div>
        {hasChanges && (
          <p className="text-xs text-amber-400 flex items-center gap-1.5 mt-3">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            You have unsaved changes
          </p>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile Information Card */}
        <div className="lg:col-span-2 flex">
          <Card variant="elevated" padding="default" className="w-full">
            <CardContent>
              <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <EditIcon className="w-4 h-4 text-indigo-400" />
                Personal Information
              </h4>
              
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-gray-200 mb-1.5 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                    Full Name
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => onFormChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-gray-200 mb-1.5 flex items-center gap-1.5">
                      <AcademicCapIcon className="w-3.5 h-3.5 text-indigo-400" />
                      Program
                    </label>
                    <Select
                      value={form.program || ''}
                      onChange={(e) => onFormChange('program', e.target.value)}
                      required
                    >
                      <option value="" disabled>Select program</option>
                      <option value="BSCS">BSCS - Computer Science</option>
                      <option value="BSIT">BSIT - Information Technology</option>
                      <option value="BSCE">BSCE - Civil Engineering</option>
                      <option value="BSCPE">BSCpE - Computer Engineering</option>
                      <option value="BSEE">BSEE - Electrical Engineering</option>
                      <option value="BSME">BSME - Mechanical Engineering</option>
                      <option value="BSA">BSA - Accountancy</option>
                      <option value="BSBA">BSBA - Business Administration</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-200 mb-1.5 flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
                      Year Level
                    </label>
                    <Select
                      value={form.yearLevel || ''}
                      onChange={(e) => onFormChange('yearLevel', parseInt(e.target.value))}
                      required
                    >
                      <option value="" disabled>Select year level</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </Select>
                  </div>
                </div>
                
                <Divider className="my-3" />
                
                <div>
                  <label className="block text-xs font-medium text-gray-200 mb-1.5 flex items-center gap-1.5">
                    <DocumentTextIcon className="w-3.5 h-3.5 text-indigo-400" />
                    Bio
                  </label>
                  <Textarea
                    rows={5}
                    value={form.bio}
                    onChange={(e) => onFormChange('bio', e.target.value)}
                    placeholder="Tell us something about yourself..."
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Write a short bio to let others know more about you</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Image Uploads Card */}
        <div className="lg:col-span-1 flex">
          <Card variant="elevated" padding="default" className="w-full">
            <CardContent>
              <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <EditIcon className="w-4 h-4 text-indigo-400" />
                Profile Images
              </h4>
              
              <div className="space-y-4">
                <ProfileImageUpload
                  preview={profilePreview}
                  inputRef={profileInputRef}
                  onChange={onProfileImageChange}
                />
                
                <Divider />
                
                <CoverImageUpload
                  preview={coverPreview}
                  inputRef={coverInputRef}
                  onChange={onCoverImageChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;