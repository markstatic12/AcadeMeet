import { authFetch } from './apiHelper';

const toDataURL = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = (err) => reject(err);
  reader.readAsDataURL(file);
});

export const imageService = {
  async uploadProfileImage(imageFile) {
    if (!imageFile) throw new Error('Image file is required');
    const dataUrl = await toDataURL(imageFile);

    const response = await authFetch('/users/me', {
      method: 'PUT',
      body: JSON.stringify({ profilePic: dataUrl })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to upload profile image');
    }

    return await response.json();
  },

  async uploadCoverImage(imageFile) {
    if (!imageFile) throw new Error('Image file is required');
    const dataUrl = await toDataURL(imageFile);

    const response = await authFetch('/users/me', {
      method: 'PUT',
      body: JSON.stringify({ coverImage: dataUrl })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to upload cover image');
    }

    return await response.json();
  },

  async deleteUserImage(imageType) {
    if (!imageType) throw new Error('Image type is required (profile|cover)');

    const payload = imageType === 'cover' ? { coverImage: '' } : { profilePic: '' };

    const response = await authFetch('/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete ${imageType} image`);
    }

    return await response.json();
  },

  validateImageFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (!file) {
      throw new Error('No file selected');
    }

    if (file.size > maxSize) {
      const fileSizeKB = (file.size / 1024).toFixed(2);
      throw new Error(`File size (${fileSizeKB} KB) must be less than 5120 KB`);
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('File must be a JPEG, PNG, or GIF image');
    }

    return true;
  }
};