import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSettingsPage = () => {
  const navigate = useNavigate();
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

  // Load student data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('student');
    if (stored) {
      const s = JSON.parse(stored);
      setStudent(s);
      setForm({
        name: s.name || '',
        school: s.school || '',
        program: s.program || 'BSIT',
        studentId: s.studentId || '',
        phone: s.phone || '',
        bio: s.bio || '',
      });
      setProfilePreview(s.profilePic || null);
      setCoverPreview(s.coverImage || null);
    }
  }, []);

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
    if (!student) return;
    
    try {
      setSaving(true);
      const res = await fetch(`http://localhost:8080/api/users/${student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          school: form.school,
          studentId: form.studentId,
          bio: form.bio,
          profilePic: profilePreview || null,
          coverImage: coverPreview || null,
        }),
      });
      
      const data = await res.json();
      
      // Update localStorage
      const next = {
        ...(student || {}),
        name: form.name,
        school: form.school,
        studentId: form.studentId,
        bio: form.bio,
        program: form.program,
        phone: form.phone,
        profilePic: profilePreview || null,
        coverImage: coverPreview || null,
      };
      localStorage.setItem('student', JSON.stringify(next));
      setStudent(next);
      
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
    localStorage.removeItem('student');
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
