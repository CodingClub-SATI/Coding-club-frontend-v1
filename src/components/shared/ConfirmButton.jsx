import { useState } from 'react';
import Button from './Button';
import styles from './Button.module.css';

export function ConfirmButton({ label, confirmLabel = 'Confirm?', onConfirm, danger }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className={styles.inline}>
        <Button
          size="small"
          variant={danger ? 'danger' : 'ghost'}
          onClick={() => { setConfirming(false); onConfirm(); }}
        >
          {confirmLabel}
        </Button>
        <Button size="small" variant="ghost" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </span>
    );
  }

  return (
    <Button
      size="small"
      variant={danger ? 'dangerOutline' : 'ghost'}
      onClick={() => setConfirming(true)}
    >
      {label}
    </Button>
  );
}
