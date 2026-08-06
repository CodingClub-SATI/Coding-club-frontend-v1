import styles from './Tabs.module.css';

/**
 * Simple pill-style tab control.
 * items: [{ value, label }], value: current active value, onChange: (value) => void
 */
export default function Tabs({ items, value, onChange, className = '' }) {
  return (
    <div className={`${styles.tabs} ${className}`.trim()} role="tablist">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={value === item.value}
          className={`${styles['tab-btn']} ${value === item.value ? styles.active : ''}`.trim()}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
