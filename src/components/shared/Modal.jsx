import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

export function Modal({ 
  title, 
  onClose, 
  children, 
  size = 'md', 
  variant = 'flat' 
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = originalStyle; // Restore on unmount
    };
  }, [onClose]);

  const modalClasses = `${styles.modal} ${styles[`variant-${variant}`]} ${styles[`size-${size}`]}`.trim();

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className={modalClasses} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
      >
        <div className={styles.header}>
          <h3 id="modal-title">{title}</h3>
          <button 
            className={styles.close} 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body // Target mount node
  );
}