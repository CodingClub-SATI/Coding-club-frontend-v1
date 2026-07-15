import styles from '/Modal.module.css';

export default function Modal({ title, onClose, children, wide }) {
  return (
    <div className="admin-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`admin-modal ${wide ? 'admin-modal-wide' : ''}`}>
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="admin-modal-body">{children}</div>
      </div>
    </div>
  );
}