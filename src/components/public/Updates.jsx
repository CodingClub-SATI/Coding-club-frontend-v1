import { Modal } from '@/components/shared/Modal';
// TODO: Import your API hook or static data here (e.g., useUpdates())

export default function UpdatesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <Modal 
      title="System Alerts" 
      onClose={onClose} 
      size="md" 
      variant="glow"
    >
      <div className="flex flex-col gap-4"> 
        
        {/* Map over your fetched data here */}
        <div className="update-item border-l-2 border-[var(--brand-accent)] pl-3">
          <span className="text-xs text-[var(--text-muted)] font-display">JUL 23, 2026</span>
          <p className="text-sm mt-1">Registration for the annual Codeathon is now open!</p>
        </div>

      </div>
    </Modal>
  );
}