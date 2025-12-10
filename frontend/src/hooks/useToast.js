import { useState, useCallback } from 'react';

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
