import { useState } from 'react';
import { X } from 'lucide-react';
import styles from './TagInput.module.css';

export function TagInput({ value = [], onChange, placeholder, id, maxTags }) {
  const [draft, setDraft] = useState('');
  const atLimit = typeof maxTags === 'number' && value.length >= maxTags;

  const commit = () => {
    if (atLimit) { setDraft(''); return; }
    const v = draft.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setDraft('');
  };

  return (
    <div className={styles.tagInput}>
      {value.map((tag, i) => (
        <span key={tag} className={styles.tag}>
          {tag}
          <button 
            type="button"
            aria-label={`Remove ${tag}`} 
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        placeholder={atLimit ? `Limit reached (${maxTags})` : (placeholder || 'Type & press Enter')}
        aria-label={placeholder || 'Add tag'}
        disabled={atLimit}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commit(); } }}
        onBlur={commit}
      />
      {typeof maxTags === 'number' && (
        <span className={styles.tagCount} aria-live="polite">{value.length}/{maxTags}</span>
      )}
    </div>
  );
}