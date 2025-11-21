import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export const useSettingsPage = () => {
  const navigate = useNavigate();
  const { getUserId, logout } = useUser();
  const [active, setActive] = useState('profile'); // 'profile' | 'password'
  const [saving, setSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [student, setStudent] = useState(null);

  // Profile form state
  const [form, setForm] = useState({
    name: '',
    school: '',
    program: '',
    studentId: '',
    phone: '',
    bio: '',
  });

  // Image previews
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
            studentId: s.studentId || '',
            phone: s.phone || '',
            bio: s.bio || '',
          });
          setProfilePreview(s.profileImageUrl || null);
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
        studentId: student.studentId || '',
        phone: student.phone || '',
        bio: student.bio || '',
      });
      setProfilePreview(student.profilePic || null);
      setCoverPreview(student.coverImage || null);
    }
  };

  const handleSaveProfile = async (showToast) => {
    const userId = getUserId();
    if (!userId) return;
    
    try {
      setSaving(true);
      const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          school: form.school,
          studentId: form.studentId,
          bio: form.bio,
          profileImageUrl: profilePreview || null,
          coverImage: coverPreview || null,
        }),
      });
      
      const data = await res.json();
      
      // Reload user data
      const updatedUser = await fetch(`http://localhost:8080/api/users/${userId}`).then(r => r.json());
      setStudent(updatedUser);
      
      showToast(data?.message || 'Profile updated', 'success');
    } catch (e) {
      console.error(e);
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

// Password Reset Hook
export const usePasswordReset = () => {
  const { getUserId } = useUser();
  const [curr, setCurr] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setCurr('');
    setNext('');
    setConfirm('');
  };

  const validatePassword = (showToast) => {
    if (next.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return false;
    }
    if (next !== confirm) {
      showToast('New password and confirmation do not match', 'error');
      return false;
    }
    const userId = getUserId();
    if (!userId) {
      showToast('No user', 'error');
      return false;
    }
    return true;
  };

  const submit = async (showToast) => {
    if (!validatePassword(showToast)) return;
    const userId = getUserId();

    try {
      setBusy(true);
      const res = await fetch('http://localhost:8080/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          currentPassword: curr,
          newPassword: next,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to change password');
      }
      
      showToast(data.message || 'Password changed successfully', 'success');
      reset();
    } catch (err) {
      console.error('Password change error:', err);
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setBusy(false);
    }
  };

  return {
    curr,
    next,
    confirm,
    busy,
    setCurr,
    setNext,
    setConfirm,
    reset,
    submit,
  };
};
