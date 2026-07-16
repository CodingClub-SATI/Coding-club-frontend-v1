import { useState, useEffect } from 'react';

export default function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    let frameId = null;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;

        frameId = window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const current = window.scrollY;
          setProgress(totalHeight > 0 ? (current / totalHeight) * 100 : 0);

          frameId = null;
          ticking = false;
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return progress;
}