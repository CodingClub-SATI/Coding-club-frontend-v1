// src/features/home/public/components/TypingText.jsx
import { useEffect, useRef } from 'react';

export default function TypingText({ 
  texts, 
  typingSpeed = 80, 
  deletingSpeed = 40, 
  delayBeforeDelete = 1800 
}) {
  const nodeRef = useRef(null);
  
  useEffect(() => {
    let timeoutId;
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentText = texts[currentTextIndex];
      
      // Direct DOM mutation
      if (nodeRef.current) {
        nodeRef.current.textContent = currentText.substring(0, currentCharIndex);
      }

      // Logic to determine the next keystroke/action
      if (!isDeleting && currentCharIndex < currentText.length) {
        currentCharIndex++;
        timeoutId = setTimeout(type, typingSpeed);
      } 
      else if (!isDeleting && currentCharIndex === currentText.length) {
        isDeleting = true;
        timeoutId = setTimeout(type, delayBeforeDelete);
      } 
      else if (isDeleting && currentCharIndex > 0) {
        currentCharIndex--;
        timeoutId = setTimeout(type, deletingSpeed);
      } 
      else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % texts.length;
        timeoutId = setTimeout(type, typingSpeed);
      }
    };

    // Kick off the loop
    timeoutId = setTimeout(type, typingSpeed);

    // Cleanup prevents the recursive loop from memory leaking if the user leaves the page
    return () => clearTimeout(timeoutId);
  }, [texts, typingSpeed, deletingSpeed, delayBeforeDelete]);

  return (
    <span className="typing-text">
      <span ref={nodeRef}></span><span className="cursor">_</span>
    </span>
  );
}