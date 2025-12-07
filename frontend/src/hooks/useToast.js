import { useState, useCallback } from 'react';

/**
 * Custom hook for managing toast notifications
 * 
 * Usage:
 * const { toast, showToast, hideToast } = useToast();
 * 
 * showToast('success', 'Session created successfully!');
 * showToast('error', 'Please fill in all required fields');
 * showToast('warning', 'This action cannot be undone');
 * showToast('info', 'Remember to save your changes');
 */

const useToast = () => {
  const [toast, setToast] = useState({
    isVisible: false,
    type: 'info',
    message: '',
  });

  const showToast = useCallback((type, message, duration = 4000) => {
    setToast({
      isVisible: true,
      type,
      message,
      duration,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};

export default useToast;
