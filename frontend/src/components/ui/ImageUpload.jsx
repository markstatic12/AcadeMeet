import React, { useState } from 'react';
import { imageService } from '../../services/ImageService';

const ImageUpload = ({ 
  currentImageUrl, 
  onImageUpdate, 
  uploadType = 'profile', // 'profile', 'cover', 'session'
  sessionId,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (file) => {
    if (!file) return;

    try {
      imageService.validateImageFile(file);
      setIsUploading(true);

      let result;
      switch (uploadType) {
        case 'profile':
          result = await imageService.uploadProfileImage(file);
          break;
        case 'cover':
          result = await imageService.uploadCoverImage(file);
          break;
        case 'session':
          result = await imageService.uploadSessionImage(sessionId, file);
          break;
        default:
          throw new Error('Invalid upload type');
      }

      onImageUpdate(result.imageUrl);
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemoveImage = async () => {
    if (!window.confirm('Are you sure you want to remove this image?')) {
      return;
    }

    try {
      setIsUploading(true);
      if (uploadType === 'session') {
        await imageService.deleteSessionImage(sessionId);
      } else {
        await imageService.deleteUserImage(uploadType);
      }
      onImageUpdate(null);
    } catch (error) {
      alert(`Failed to remove image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const getPlaceholderText = () => {
    switch (uploadType) {
      case 'profile':
        return 'Upload Profile Picture';
      case 'cover':
        return 'Upload Cover Image';
      case 'session':
        return 'Upload Session Image';
      default:
        return 'Upload Image';
    }
  };

  const getAspectRatio = () => {
    switch (uploadType) {
      case 'cover':
        return 'aspect-[3/1]';
      case 'session':
        return 'aspect-[16/9]';
      case 'profile':
      default:
        return 'aspect-square';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'}
          ${getAspectRatio()}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {currentImageUrl ? (
          <div className="relative w-full h-full">
            <img
              src={currentImageUrl}
              alt={getPlaceholderText()}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="flex space-x-2">
                <label className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg cursor-pointer transition-colors">
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                <button
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full mb-2"></div>
                <p className="text-gray-400 text-sm">Uploading...</p>
              </div>
            ) : (
              <>
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-300 font-medium mb-2">{getPlaceholderText()}</p>
                <p className="text-gray-400 text-sm mb-4">
                  Drag & drop an image here, or click to select
                </p>
                <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                  Select Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
                <p className="text-gray-500 text-xs mt-2">
                  Max size: 5120 KB per image. Formats: JPEG, PNG, GIF
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;