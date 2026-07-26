import styles from './Toggle.module.css';

export function Toggle({ checked, onChange, label, disabled = false }) {
  return (
    <label className={`${styles.toggle} ${disabled ? styles.disabled : ''}`.trim()}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-disabled={disabled}
        onChange={(e) => {
          if (!disabled) onChange(e.target.checked);
        }} 
      />
      <span className={styles.track}><span className={styles.thumb} /></span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}