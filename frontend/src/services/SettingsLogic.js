import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { authFetch } from './apiHelper';

export const useSettingsPage = () => {
  const navigate = useNavigate();
  const { logout } = useUser();
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

  // Load student data from backend using JWT
  useEffect(() => {
    authFetch('/users/me')
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
  }, []);

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
    try {
      setSaving(true);
      
      // Prepare data to send (user ID extracted from JWT by backend)
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
      
      // Use /users/me endpoint - user ID extracted from JWT token
      const res = await authFetch('/users/me', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || `Server responded with ${res.status}`;
        console.error('Update failed:', errorMessage, 'Status:', res.status);
        throw new Error(errorMessage);
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
      
      // Check file size (limit to 5MB = 5120 KB per image)
      if (file.size > 5 * 1024 * 1024) {
        const fileSizeKB = (file.size / 1024).toFixed(2);
        alert(`Profile image size (${fileSizeKB} KB) must be less than 5120 KB. Each image has a separate 5120 KB limit.`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const img = new Image();
          img.onload = () => {
            try {
              // Compress image to max 800x800 for profile with better compression
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
              
              // Use 0.6 quality for good balance between size and quality
              const compressedData = canvas.toDataURL('image/jpeg', 0.6);
              console.log('Profile image compressed, original:', file.size, 'compressed:', compressedData.length);
              
              // Additional check: if compressed data is still too large (>300KB for Base64), compress more
              if (compressedData.length > 300 * 1024) {
                console.log('Profile image still too large, applying extra compression');
                const extraCompressed = canvas.toDataURL('image/jpeg', 0.4);
                console.log('Extra compressed size:', extraCompressed.length);
                setProfilePreview(extraCompressed);
              } else {
                setProfilePreview(compressedData);
              }
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
      
      // Check file size (limit to 5MB = 5120 KB per image)
      if (file.size > 5 * 1024 * 1024) {
        const fileSizeKB = (file.size / 1024).toFixed(2);
        alert(`Cover image size (${fileSizeKB} KB) must be less than 5120 KB. Each image has a separate 5120 KB limit.`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const img = new Image();
          img.onload = () => {
            try {
              // Compress image to max 1200px width for cover with more aggressive compression
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              let width = img.width;
              let height = img.height;
              const maxWidth = 1200;
              const maxHeight = 400; // Limit height for cover images
              
              // Scale down maintaining aspect ratio, but also limit height
              if (width > maxWidth || height > maxHeight) {
                const widthRatio = maxWidth / width;
                const heightRatio = maxHeight / height;
                const ratio = Math.min(widthRatio, heightRatio);
                
                width = width * ratio;
                height = height * ratio;
              }
              
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);
              
              // More aggressive compression (0.5 instead of 0.7) to keep Base64 size smaller
              const compressedData = canvas.toDataURL('image/jpeg', 0.5);
              console.log('Cover image compressed, original:', file.size, 'compressed:', compressedData.length);
              
              // Additional check: if compressed data is still too large (>500KB for Base64), compress more
              if (compressedData.length > 500 * 1024) {
                console.log('Cover image still too large, applying extra compression');
                const extraCompressed = canvas.toDataURL('image/jpeg', 0.3);
                console.log('Extra compressed size:', extraCompressed.length);
                setCoverPreview(extraCompressed);
              } else {
                setCoverPreview(compressedData);
              }
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
