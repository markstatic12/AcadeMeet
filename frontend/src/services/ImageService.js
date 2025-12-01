import { authFetch, authFetchMultipart } from './apiHelper';

const API_BASE_URL = '';

export const imageService = {
  async uploadProfileImage(userId, imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await authFetchMultipart(`/users/${userId}/profile-image`, formData);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to upload profile image');
    }

    return await response.json();
  },

  async uploadCoverImage(userId, imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await authFetchMultipart(`/users/${userId}/cover-image`, formData);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to upload cover image');
    }

    return await response.json();
  },

  async uploadSessionImage(sessionId, imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await authFetchMultipart(`/sessions/${sessionId}/image`, formData);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to upload session image');
    }

    return await response.json();
  },

  async deleteUserImage(userId, imageType) {
    const response = await authFetch(`/users/${userId}/${imageType}-image`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete ${imageType} image`);
    }

    return await response.json();
  },

  async deleteSessionImage(sessionId) {
    const response = await authFetch(`/sessions/${sessionId}/image`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to delete session image');
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
      throw new Error('File size must be less than 5MB');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('File must be a JPEG, PNG, or GIF image');
    }

    return true;
  }
};