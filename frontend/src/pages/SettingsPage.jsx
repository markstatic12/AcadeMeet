import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import SettingsHeader, { SettingsSidebar, Toast, LogoutModal } from '../components/settings/SettingsLayout';
import ProfileForm from '../components/settings/SettingsForm';
import { useSettingsPage } from '../services/SettingsLogic';
import { useToast } from '../services/CommonUtils';
import '../styles/settings/SettingsPage.css';

const SettingsPage = () => {
  const {
    active,
    saving,
    showLogoutConfirm,
    form,
    profilePreview,
    coverPreview,
    profileInputRef,
    coverInputRef,
    setActive,
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
      
      <SettingsHeader onBack={handleBack} />

      <div className='flex gap-10'>
        <SettingsSidebar
          active={active}
          onTabChange={setActive}
          onLogoutClick={() => setShowLogoutConfirm(true)}
        />

        <div className='flex-1'>
          <div className='bg-[#1f1f1f] border border-gray-800 rounded-2xl p-6'>
            <ProfileForm
              form={form}
              onFormChange={handleFormChange}
              saving={saving}
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
