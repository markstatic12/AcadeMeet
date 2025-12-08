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
      
      // Validate image sizes before sending
      if (profilePreview && profilePreview.length > 250 * 1024) {
        showToast('❌ Profile image is too large after compression. Please use a smaller image.', 'error');
        setSaving(false);
        return;
      }
      
      if (coverPreview && coverPreview.length > 250 * 1024) {
        showToast('❌ Cover image is too large after compression. Please use a smaller image.', 'error');
        setSaving(false);
        return;
      }
      
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
        profilePic: updateData.profilePic ? `[Base64 image: ${(updateData.profilePic.length / 1024).toFixed(2)} KB]` : null,
        coverImage: updateData.coverImage ? `[Base64 image: ${(updateData.coverImage.length / 1024).toFixed(2)} KB]` : null,
      });
      
      // Use /users/me endpoint - user ID extracted from JWT token
      const res = await authFetch('/users/me', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        let errorMessage = errorData.error || errorData.message || `Server error (${res.status})`;
        
        // Parse specific error types
        if (errorMessage.includes('Data too long')) {
          if (errorMessage.includes('profile_image_url')) {
            errorMessage = '❌ Profile image is too large for database!\n\nThe compressed image still exceeds storage limits.\nPlease use a much smaller or simpler image.';
          } else if (errorMessage.includes('cover_image_url')) {
            errorMessage = '❌ Cover image is too large for database!\n\nThe compressed image still exceeds storage limits.\nPlease use a much smaller or simpler image.';
          } else {
            errorMessage = '❌ Image data is too large!\n\nOne or both images exceed database storage limits.\nPlease use smaller images.';
          }
        } else if (errorMessage.includes('Duplicate entry')) {
          errorMessage = '❌ Duplicate entry detected!\n\nThis email or username may already be in use.';
        } else if (errorMessage.includes('violates')) {
          errorMessage = '❌ Data validation failed!\n\nPlease check all fields meet requirements.';
        } else if (res.status === 401) {
          errorMessage = '❌ Authentication failed!\n\nYour session may have expired. Please login again.';
        } else if (res.status === 403) {
          errorMessage = '❌ Access denied!\n\nYou do not have permission to update this profile.';
        } else if (res.status === 404) {
          errorMessage = '❌ Profile not found!\n\nYour account may have been deleted.';
        } else if (res.status >= 500) {
          errorMessage = `❌ Server error!\n\nThe server encountered an error (${res.status}).\nPlease try again later.`;
        }
        
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
        profilePic: newProfilePic ? `[Image: ${(newProfilePic.length / 1024).toFixed(2)} KB]` : null,
        coverImage: newCoverImage ? `[Image: ${(newCoverImage.length / 1024).toFixed(2)} KB]` : null,
      });
      
      setForm(newFormValues);
      setOriginalForm(newFormValues);
      setProfilePreview(newProfilePic);
      setOriginalProfilePreview(newProfilePic);
      setCoverPreview(newCoverImage);
      setOriginalCoverPreview(newCoverImage);
      
      console.log('Images updated successfully');
      
      showToast('✅ Profile updated successfully!', 'success');
    } catch (e) {
      console.error('Update error:', e);
      showToast(e.message || '❌ Failed to update profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Profile image selected:', file.name, file.size);
      
      // Check file size (limit to 5MB = 5120 KB)
      if (file.size > 5 * 1024 * 1024) {
        const fileSizeKB = (file.size / 1024).toFixed(2);
        alert(`❌ Profile image is too large!\n\nYour image: ${fileSizeKB} KB\nMaximum allowed: 5,120 KB (5 MB)\n\nPlease choose a smaller image or compress it before uploading.`);
        if (profileInputRef.current) profileInputRef.current.value = '';
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
              
              // Start with aggressive compression
              let quality = 0.5;
              let compressedData = canvas.toDataURL('image/jpeg', quality);
              
              // Base64 adds ~33% overhead, so target max 200KB for ~270KB final size
              // This ensures it stays well under typical VARCHAR limits
              const maxBase64Size = 200 * 1024;
              
              // Reduce quality until we meet size requirements
              while (compressedData.length > maxBase64Size && quality > 0.1) {
                quality -= 0.05;
                compressedData = canvas.toDataURL('image/jpeg', quality);
                console.log(`Profile compression attempt at quality ${quality.toFixed(2)}: ${(compressedData.length / 1024).toFixed(2)} KB`);
              }
              
              if (compressedData.length > maxBase64Size) {
                alert(`❌ Unable to compress profile image enough!\n\nFinal size: ${(compressedData.length / 1024).toFixed(2)} KB\nRequired: under 200 KB\n\nPlease use a smaller or simpler image.`);
                if (profileInputRef.current) profileInputRef.current.value = '';
                return;
              }
              
              console.log(`Profile image compressed successfully: ${file.size} bytes → ${(compressedData.length / 1024).toFixed(2)} KB at quality ${quality.toFixed(2)}`);
              setProfilePreview(compressedData);
            } catch (error) {
              console.error('Error compressing profile image:', error);
              alert(`❌ Failed to process profile image!\n\nError: ${error.message}\n\nPlease try a different image format (JPG/PNG recommended).`);
              if (profileInputRef.current) profileInputRef.current.value = '';
            }
          };
          img.onerror = () => {
            console.error('Error loading profile image');
            alert('❌ Failed to load profile image!\n\nThe image file may be corrupted or in an unsupported format.\n\nPlease try a different image.');
            if (profileInputRef.current) profileInputRef.current.value = '';
          };
          img.src = ev.target.result;
        } catch (error) {
          console.error('Error processing profile image:', error);
          alert(`❌ Failed to read profile image!\n\nError: ${error.message}\n\nPlease try again or use a different image.`);
          if (profileInputRef.current) profileInputRef.current.value = '';
        }
      };
      reader.onerror = () => {
        alert('❌ Failed to read the profile image file!\n\nPlease check the file and try again.');
        if (profileInputRef.current) profileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Cover image selected:', file.name, file.size);
      
      // Check file size (limit to 5MB = 5120 KB)
      if (file.size > 5 * 1024 * 1024) {
        const fileSizeKB = (file.size / 1024).toFixed(2);
        alert(`❌ Cover image is too large!\n\nYour image: ${fileSizeKB} KB\nMaximum allowed: 5,120 KB (5 MB)\n\nPlease choose a smaller image or compress it before uploading.`);
        if (coverInputRef.current) coverInputRef.current.value = '';
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
              const maxHeight = 400;
              
              // Scale down maintaining aspect ratio
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
              
              // Start with aggressive compression
              let quality = 0.4;
              let compressedData = canvas.toDataURL('image/jpeg', quality);
              
              // Base64 adds ~33% overhead, so target max 200KB for ~270KB final size
              const maxBase64Size = 200 * 1024;
              
              // Reduce quality until we meet size requirements
              while (compressedData.length > maxBase64Size && quality > 0.1) {
                quality -= 0.05;
                compressedData = canvas.toDataURL('image/jpeg', quality);
                console.log(`Cover compression attempt at quality ${quality.toFixed(2)}: ${(compressedData.length / 1024).toFixed(2)} KB`);
              }
              
              if (compressedData.length > maxBase64Size) {
                alert(`❌ Unable to compress cover image enough!\n\nFinal size: ${(compressedData.length / 1024).toFixed(2)} KB\nRequired: under 200 KB\n\nPlease use a smaller or simpler image.`);
                if (coverInputRef.current) coverInputRef.current.value = '';
                return;
              }
              
              console.log(`Cover image compressed successfully: ${file.size} bytes → ${(compressedData.length / 1024).toFixed(2)} KB at quality ${quality.toFixed(2)}`);
              setCoverPreview(compressedData);
            } catch (error) {
              console.error('Error compressing cover image:', error);
              alert(`❌ Failed to process cover image!\n\nError: ${error.message}\n\nPlease try a different image format (JPG/PNG recommended).`);
              if (coverInputRef.current) coverInputRef.current.value = '';
            }
          };
          img.onerror = () => {
            console.error('Error loading cover image');
            alert('❌ Failed to load cover image!\n\nThe image file may be corrupted or in an unsupported format.\n\nPlease try a different image.');
            if (coverInputRef.current) coverInputRef.current.value = '';
          };
          img.src = ev.target.result;
        } catch (error) {
          console.error('Error processing cover image:', error);
          alert(`❌ Failed to read cover image!\n\nError: ${error.message}\n\nPlease try again or use a different image.`);
          if (coverInputRef.current) coverInputRef.current.value = '';
        }
      };
      reader.onerror = () => {
        alert('❌ Failed to read the cover image file!\n\nPlease check the file and try again.');
        if (coverInputRef.current) coverInputRef.current.value = '';
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
