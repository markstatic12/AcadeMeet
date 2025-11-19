import React from 'react';

const Toast = ({ toast }) => {
  if (!toast) return null;

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-600/20 border-green-500 text-green-200';
      case 'error':
        return 'bg-red-600/20 border-red-500 text-red-200';
      default:
        return 'bg-gray-700/80 border-gray-600 text-gray-100';
    }
  };

  return (
    <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-lg shadow-lg border text-sm ${getToastStyles()}`}>
      {toast.message}
    </div>
  );
};

export default Toast;
