import { useState, useEffect } from 'react';

// Click outside hook utility
export const useClickOutside = (handlers) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      handlers.forEach(({ condition, selector, callback }) => {
        if (condition && !event.target.closest(selector)) {
          callback();
        }
      });
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handlers]);
};

// Toast notification hook utility
export const useToast = () => {
  const [toast, setToast] = useState(null);
  
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  return { toast, showToast };
};

// Panel height utility hook
export const usePanelHeight = () => {
  const [panelHeight, setPanelHeight] = useState(400);

  const updatePanelHeight = (height) => {
    setPanelHeight(height);
  };

  return { panelHeight, updatePanelHeight };
};