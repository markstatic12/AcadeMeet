import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export const useSettingsPage = () => {
  const navigate = useNavigate();
  const { getUserId, logout } = useUser();
  const [active, setActive] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [student, setStudent] = useState(null);

  // Profile form state
  const [form, setForm] = useState({
    name: '',
    school: '',
    program: '',
    yearLevel: '',
    studentId: '',
    phone: '',
    bio: '',
  });

  // Image previews (base64 or URLs)
  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Load student data from backend
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      fetch(`http://localhost:8080/api/users/${userId}`)
        .then(res => res.json())
        .then(s => {
          setStudent(s);
          setForm({
            name: s.name || '',
            school: s.school || '',
            program: s.program || 'BSIT',
            yearLevel: (s.yearLevel != null ? String(s.yearLevel) : ''),
            studentId: s.studentId || '',
            phone: s.phone || '',
            bio: s.bio || '',
          });
          setProfilePreview(s.profilePic || s.profileImageUrl || null);
          setCoverPreview(s.coverImage || null);
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
      setForm({
        name: student.name || '',
        school: student.school || '',
        program: student.program || 'BSIT',
        yearLevel: (student.yearLevel != null ? String(student.yearLevel) : ''),
        studentId: student.studentId || '',
        phone: student.phone || '',
        bio: student.bio || '',
      });
      setProfilePreview(student.profilePic || student.profileImageUrl || null);
      setCoverPreview(student.coverImage || null);
    }
  };

  const handleSaveProfile = async (showToast) => {
    const userId = getUserId();
    if (!userId) return;
    
    try {
      setSaving(true);
      // Parse yearLevel to integer before sending
      const yearLevelInt = form.yearLevel ? parseInt(form.yearLevel, 10) : null;
      
      // Save profile data including images (as base64 strings for now)
      const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          school: form.school,
          program: form.program,
          yearLevel: yearLevelInt,
          studentId: form.studentId,
          bio: form.bio,
          profilePic: profilePreview,  // Send current preview (base64 or URL)
          coverImage: coverPreview,     // Send current preview (base64 or URL)
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      // Reload user data from backend to get updated data
      const updatedUser = await fetch(`http://localhost:8080/api/users/${userId}`).then(r => r.json());
      setStudent(updatedUser);
      
      // Update preview images from saved data
      setProfilePreview(updatedUser.profilePic || updatedUser.profileImageUrl || null);
      setCoverPreview(updatedUser.coverImage || updatedUser.coverImageUrl || null);
      
      showToast('Profile updated successfully', 'success');

      // Trigger a custom event to notify other components about profile update
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { userId } }));
    } catch (e) {
      console.error(e);
      showToast('Failed to update profile: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('File must be a JPEG, PNG, or GIF image');
        return;
      }

      // Convert to base64 and store as preview
      const reader = new FileReader();
      reader.onload = (ev) => setProfilePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('File must be a JPEG, PNG, or GIF image');
        return;
      }

      // Convert to base64 and store as preview
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
    active,
    saving,
    showLogoutConfirm,
    student,
    form,
    profilePreview,
    coverPreview,
    profileInputRef,
    coverInputRef,
    // Setters
    setActive,
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
