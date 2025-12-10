import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from './apiClient';

export const useSettingsPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout, refreshUser } = useUser(); 
  const [saving, setSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [student, setStudent] = useState(null);

  const [form, setForm] = useState({
    name: '',
    program: '',
    bio: '',
    yearLevel: '',
  });

  const [originalForm, setOriginalForm] = useState({
    name: '',
    program: '',
    bio: '',
    yearLevel: '',
  });

  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [originalProfilePreview, setOriginalProfilePreview] = useState(null);
  const [originalCoverPreview, setOriginalCoverPreview] = useState(null);
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const hasChanges = () => {
    const formChanged = Object.keys(form).some(key => {
      const current = String(form[key] || '');
      const original = String(originalForm[key] || '');
      return current !== original;
    });
    
    const imagesChanged = 
      profilePreview !== originalProfilePreview ||
      coverPreview !== originalCoverPreview;
    
    return formChanged || imagesChanged;
  };

  useEffect(() => {
    if (currentUser) {
      const loadedForm = {
        name: currentUser.name || '',
        program: currentUser.program || '',
        bio: currentUser.bio || '',
        yearLevel: currentUser.yearLevel || '',
      };
      
      setForm(loadedForm);
      setOriginalForm(loadedForm);
      setProfilePreview(currentUser.profilePic || null);
      setOriginalProfilePreview(currentUser.profilePic || null);
    }

    api.get('/users/me')
      .then(res => res.data)
      .then(s => {
        console.log('Loaded user data:', s);
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
  }, [currentUser]);

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
      
      const res = await api.put('/users/me', updateData);
      const data = res.data;
      console.log('Update response:', data);
      
      setStudent(data);
      
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
      
      await refreshUser();
      
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
              
              let quality = 0.5;
              let compressedData = canvas.toDataURL('image/jpeg', quality);
              
              const maxBase64Size = 200 * 1024;
              
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
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              let width = img.width;
              let height = img.height;
              const maxWidth = 1200;
              const maxHeight = 400;
              
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
              
              let quality = 0.4;
              let compressedData = canvas.toDataURL('image/jpeg', quality);
              
              const maxBase64Size = 200 * 1024;
              
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
