import { X } from 'lucide-react';
import styles from './Modal.module.css';

export function Modal({ title, onClose, children, wide, variant = 'flat' }) {
  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`${styles.modal} ${variant === 'glow' ? styles.glow : ''} ${wide ? styles.wide : ''}`}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <button className={styles.close} onClick={onClose}><X size={18} /></button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}