import { useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';
import styles from './ImageDrop.module.css';

/* (stores a local object URL — no backend yet) ---------- */
export default function ImageDrop({ value, onChange, label, aspect }) {
  const createdUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (createdUrlRef.current) URL.revokeObjectURL(createdUrlRef.current);
    };
  }, []);

  const handleFile = (file) => {
    if (!file) return;
    if (createdUrlRef.current) URL.revokeObjectURL(createdUrlRef.current);
    const url = URL.createObjectURL(file);
    createdUrlRef.current = url;
    onChange(url);
  };

  return (
    <label
      className={styles.imageDrop}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <img src={value} alt={label || 'preview'} />
      ) : (
        <div className={styles.empty}>
          <Upload size={20} aria-hidden="true" />
          <span>{label || 'Upload image'}</span>
        </div>
      )}
    </label>
  );
}
