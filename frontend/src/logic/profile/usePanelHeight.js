import { useState, useEffect } from 'react';

export const usePanelHeight = (leftProfileCardRef, dependencies) => {
  const [panelHeight, setPanelHeight] = useState(null);

  useEffect(() => {
    const syncHeights = () => {
      const h = leftProfileCardRef.current?.offsetHeight;
      if (h && typeof h === 'number') {
        setPanelHeight(h);
      }
    };
    syncHeights();
    window.addEventListener('resize', syncHeights);
    return () => window.removeEventListener('resize', syncHeights);
  }, dependencies);

  return panelHeight;
};
