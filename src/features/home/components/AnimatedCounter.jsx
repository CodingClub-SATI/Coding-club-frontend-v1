import { useState, useEffect, useRef } from 'react';

export default function AnimatedCounter({ value, duration = 1500 }) {
  const [count, setCount] = useState(0);
  const observerRef = useRef(null);
  
  useEffect(() => {
    const node = observerRef.current;
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
            
            setCount(Math.floor(progress * value));
            
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

  return <span ref={observerRef}>{count}</span>;
}