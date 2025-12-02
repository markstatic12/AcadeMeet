import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { authFetch } from './apiHelper';

export const useSettingsPage = () => {
  const navigate = useNavigate();
  const { getUserId, logout } = useUser();
  const [saving, setSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [student, setStudent] = useState(null);

  // Profile form state
  const [form, setForm] = useState({
    name: '',
    school: '',
    program: '',
    phone: '',
    bio: '',
    yearLevel: '',
  });

  // Track original form values to detect changes
  const [originalForm, setOriginalForm] = useState({
    name: '',
    school: '',
    program: '',
    phone: '',
    bio: '',
    yearLevel: '',
  });

  // Image previews
  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [originalProfilePreview, setOriginalProfilePreview] = useState(null);
  const [originalCoverPreview, setOriginalCoverPreview] = useState(null);
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Detect if form has changes
  const hasChanges = () => {
    const formChanged = Object.keys(form).some(key => {
      // Convert both to strings for comparison to handle number/string differences
      const current = String(form[key] || '');
      const original = String(originalForm[key] || '');
      return current !== original;
    });
    
    const imagesChanged = 
      profilePreview !== originalProfilePreview ||
      coverPreview !== originalCoverPreview;
    
    return formChanged || imagesChanged;
  };

  // Load student data from backend
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      authFetch(`/users/${userId}`)
        .then(res => res.json())
        .then(s => {
          console.log('Loaded user data:', s); // Debug log
          setStudent(s);
          
          const loadedForm = {
            name: s.name || '',
            school: s.school || '',
            program: s.program || '',
            phone: s.phone || '',
            bio: s.bio || '',
            yearLevel: s.yearLevel || '',
          };
          
          const loadedProfilePic = s.profileImageUrl || s.profilePic || null;
          const loadedCoverImage = s.coverImage || null;
          
          setForm(loadedForm);
          setOriginalForm(loadedForm);
          setProfilePreview(loadedProfilePic);
          setOriginalProfilePreview(loadedProfilePic);
          setCoverPreview(loadedCoverImage);
          setOriginalCoverPreview(loadedCoverImage);
        })
        .catch(err => console.error('Failed to load user', err));
    }
  }, [getUserId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    if (student) {
      setForm({ ...originalForm });
      setProfilePreview(originalProfilePreview);
      setCoverPreview(originalCoverPreview);
    }
  };

  const handleSaveProfile = async (showToast) => {
    const userId = getUserId();
    if (!userId) return;
    
    try {
      setSaving(true);
      
      // Prepare data to send
      const updateData = {
        name: form.name,
        school: form.school,
        program: form.program,
        bio: form.bio,
        yearLevel: form.yearLevel ? parseInt(form.yearLevel) : null,
        profileImageUrl: profilePreview || null,
        coverImage: coverPreview || null,
      };
      
      console.log('Sending update data:', updateData); // Debug log
      
      const res = await authFetch(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      const data = await res.json();
      console.log('Update response:', data); // Debug log
      
      // Reload user data
      const updatedUser = await authFetch(`/users/${userId}`).then(r => r.json());
      setStudent(updatedUser);
      
      // Update original form values to new values
      const newFormValues = {
        name: updatedUser.name || '',
        school: updatedUser.school || '',
        program: updatedUser.program || '',
        phone: updatedUser.phone || '',
        bio: updatedUser.bio || '',
        yearLevel: updatedUser.yearLevel || '',
      };
      
      const newProfilePic = updatedUser.profileImageUrl || updatedUser.profilePic || null;
      const newCoverImage = updatedUser.coverImage || null;
      
      setForm(newFormValues);
      setOriginalForm(newFormValues);
      setProfilePreview(newProfilePic);
      setOriginalProfilePreview(newProfilePic);
      setCoverPreview(newCoverImage);
      setOriginalCoverPreview(newCoverImage);
      
      showToast(data?.message || 'Profile updated successfully', 'success');
    } catch (e) {
      console.error('Update error:', e);
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfilePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setCoverPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  return {
    // State
    saving,
    showLogoutConfirm,
    student,
    form,
    profilePreview,
    coverPreview,
    profileInputRef,
    coverInputRef,
    hasChanges: hasChanges(),
    // Setters
    setShowLogoutConfirm,
    // Handlers
    handleBack,
    handleFormChange,
    handleCancel,
    handleSaveProfile,
    handleProfileImageChange,
    handleCoverImageChange,
    handleLogout,
  };
};
