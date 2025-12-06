import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import PageHeader from '../components/common/PageHeader';
import { SettingsSidebar, Toast, LogoutModal } from '../components/settings/SettingsLayout';
import ProfileForm from '../components/settings/SettingsForm';
import { useSettingsPage } from '../services/SettingsLogic';
import { useToast } from '../services/CommonUtils';
import '../styles/settings/SettingsPage.css';

const SettingsPage = () => {
  const {
    saving,
    showLogoutConfirm,
    form,
    profilePreview,
    coverPreview,
    profileInputRef,
    coverInputRef,
    hasChanges,
    setShowLogoutConfirm,
    handleBack,
    handleFormChange,
    handleCancel,
    handleSaveProfile,
    handleProfileImageChange,
    handleCoverImageChange,
    handleLogout,
  } = useSettingsPage();

  const { toast, showToast } = useToast();

  return (
    <DashboardLayout>
      <Toast toast={toast} />

      <div className='flex gap-5 max-w-[1400px] mx-auto'>
        <SettingsSidebar
          onLogoutClick={() => setShowLogoutConfirm(true)}
        />

        <div className='flex-1 min-w-0'>
          <ProfileForm
            form={form}
            onFormChange={handleFormChange}
            saving={saving}
            hasChanges={hasChanges}
            onCancel={handleCancel}
            onSave={() => handleSaveProfile(showToast)}
            profilePreview={profilePreview}
            coverPreview={coverPreview}
            profileInputRef={profileInputRef}
            coverInputRef={coverInputRef}
            onProfileImageChange={handleProfileImageChange}
            onCoverImageChange={handleCoverImageChange}
          />
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </DashboardLayout>
  );
};

export default SettingsPage;
