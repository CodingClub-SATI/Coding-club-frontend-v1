// src/features/home/public/components/AnimatedCounter.jsx
import { useEffect, useRef } from 'react';

export default function AnimatedCounter({ value, duration = 1500 }) {
  const nodeRef = useRef(null);
  
  useEffect(() => {
    const node = nodeRef.current;
    if (!node || typeof value !== 'number') return;

    let frameId;
    let start;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start = Date.now();
          
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Direct DOM mutation for the strict number
            if (nodeRef.current) {
              nodeRef.current.textContent = Math.floor(progress * value);
            }
            
            if (progress < 1) {
              frameId = requestAnimationFrame(tick);
            }
          };
          
          frameId = requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [value, duration]);

  // Initial render is 0
  return <span ref={nodeRef}>0</span>;
}