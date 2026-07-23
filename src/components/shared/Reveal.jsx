// src/components/shared/Reveal.jsx
import { useEffect, useRef } from 'react';

export default function Reveal({ 
  Component = 'div', 
  children, 
  className = '', 
  delay = 0,
  threshold = 0.1 
}) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Direct DOM mutation — ZERO React re-renders triggered
          ref.current.setAttribute('data-visible', 'true');
          observer.disconnect(); 
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Component
      ref={ref}
      className={`reveal-element ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Component>
  );
}