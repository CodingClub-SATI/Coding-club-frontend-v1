import { useState } from 'react';
import Button from './Button';
import styles from './Button.module.css';

export function ConfirmButton({ label, confirmLabel = 'Confirm?', onConfirm, danger }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className={styles.inlineConfirm}>
        <Button
          size="sm"
          tone={danger ? 'danger' : 'primary'}
          variant={danger ? 'filled' : 'ghost'}
          onClick={() => { setConfirming(false); onConfirm(); }}
        >
          {confirmLabel}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </span>
    );
  }

  return (
    <Button
      size="sm"
      tone={danger ? 'danger' : 'primary'}
      variant={danger ? 'outline' : 'ghost'}
      onClick={() => setConfirming(true)}
    >
      {label}
    </Button>
  );
}
