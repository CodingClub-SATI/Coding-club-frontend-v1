import { useState } from 'react';
import { X } from 'lucide-react';
import styles from './TagInput.module.css';

export function TagInput({ value = [], onChange, placeholder }) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const v = draft.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setDraft('');
  };

  return (
    <div className={styles.tagInput}>
      {value.map((tag, i) => (
        <span key={tag} className={styles.tag}>
          {tag}
          <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))}>
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        placeholder={placeholder || 'Type & press Enter'}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commit(); } }}
        onBlur={commit}
      />
    </div>
  );
}
