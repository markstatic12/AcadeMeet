import { useEffect } from 'react';

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
