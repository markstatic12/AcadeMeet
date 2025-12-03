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
    program: '',
    bio: '',
    yearLevel: '',
  });

  // Track original form values to detect changes
  const [originalForm, setOriginalForm] = useState({
    name: '',
    program: '',
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
            program: s.program || '',
            bio: s.bio || '',
            yearLevel: s.yearLevel || '',
          };
          
          const loadedProfilePic = s.profilePic || null;
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
        program: form.program,
        bio: form.bio,
        yearLevel: form.yearLevel ? parseInt(form.yearLevel) : null,
        profilePic: profilePreview,
        coverImage: coverPreview,
      };
      
      console.log('Sending update data:', {
        ...updateData,
        profilePic: updateData.profilePic ? `[Base64 image: ${updateData.profilePic.substring(0, 50)}...]` : null,
        coverImage: updateData.coverImage ? `[Base64 image: ${updateData.coverImage.substring(0, 50)}...]` : null,
      });
      
      const res = await authFetch(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Update response:', data);
      
      // Use the response data directly instead of reloading
      setStudent(data);
      
      // Update form values from response
      const newFormValues = {
        name: data.name || '',
        program: data.program || '',
        bio: data.bio || '',
        yearLevel: data.yearLevel || '',
      };
      
      const newProfilePic = data.profilePic || null;
      const newCoverImage = data.coverImage || null;
      
      console.log('Setting new images:', {
        profilePic: newProfilePic ? `[Image: ${newProfilePic.substring(0, 50)}...]` : null,
        coverImage: newCoverImage ? `[Image: ${newCoverImage.substring(0, 50)}...]` : null,
      });
      
      console.log('Current previews before update:', {
        profilePreview: profilePreview ? profilePreview.substring(0, 50) : null,
        coverPreview: coverPreview ? coverPreview.substring(0, 50) : null,
      });
      
      setForm(newFormValues);
      setOriginalForm(newFormValues);
      setProfilePreview(newProfilePic);
      setOriginalProfilePreview(newProfilePic);
      setCoverPreview(newCoverImage);
      setOriginalCoverPreview(newCoverImage);
      
      console.log('Images updated successfully');
      
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
      console.log('Profile image selected:', file.name, file.size);
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const img = new Image();
          img.onload = () => {
            try {
              // Compress image to max 800x800 for profile
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              let width = img.width;
              let height = img.height;
              const maxSize = 800;
              
              if (width > height) {
                if (width > maxSize) {
                  height = (height * maxSize) / width;
                  width = maxSize;
                }
              } else {
                if (height > maxSize) {
                  width = (width * maxSize) / height;
                  height = maxSize;
                }
              }
              
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);
              
              const compressedData = canvas.toDataURL('image/jpeg', 0.8);
              console.log('Profile image compressed, original:', file.size, 'compressed:', compressedData.length);
              setProfilePreview(compressedData);
            } catch (error) {
              console.error('Error compressing profile image, using original:', error);
              setProfilePreview(ev.target.result);
            }
          };
          img.onerror = () => {
            console.error('Error loading profile image, using original');
            setProfilePreview(ev.target.result);
          };
          img.src = ev.target.result;
        } catch (error) {
          console.error('Error processing profile image:', error);
          setProfilePreview(ev.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Cover image selected:', file.name, file.size);
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const img = new Image();
          img.onload = () => {
            try {
              // Compress image to max 1200px width for cover
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              let width = img.width;
              let height = img.height;
              const maxWidth = 1200;
              
              if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
              }
              
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);
              
              const compressedData = canvas.toDataURL('image/jpeg', 0.8);
              console.log('Cover image compressed, original:', file.size, 'compressed:', compressedData.length);
              setCoverPreview(compressedData);
            } catch (error) {
              console.error('Error compressing cover image, using original:', error);
              setCoverPreview(ev.target.result);
            }
          };
          img.onerror = () => {
            console.error('Error loading cover image, using original');
            setCoverPreview(ev.target.result);
          };
          img.src = ev.target.result;
        } catch (error) {
          console.error('Error processing cover image:', error);
          setCoverPreview(ev.target.result);
        }
      };
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
