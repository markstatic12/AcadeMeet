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
// Returns a CSS height string (e.g. '480px') based on the referenced element's height.
// Usage: const panelHeight = usePanelHeight(ref, [deps]);
export const usePanelHeight = (ref, deps = []) => {
  const [panelHeight, setPanelHeight] = useState(null);

  useEffect(() => {
    const calc = () => {
      try {
        if (ref && ref.current) {
          const h = Math.max(0, Math.round(ref.current.getBoundingClientRect().height));
          setPanelHeight(h ? `${h}px` : null);
        } else {
          setPanelHeight(null);
        }
      } catch (e) {
        console.warn('usePanelHeight calc error', e);
        setPanelHeight(null);
      }
    };

    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
    // deps should include any values that affect the reference size (e.g. userData)
  }, deps);

  return panelHeight;
};