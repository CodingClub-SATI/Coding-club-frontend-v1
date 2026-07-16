import styles from './ImageDrop.module.css';

/* (stores a local object URL — no backend yet) ---------- */
export default function ImageDrop({ value, onChange, label, aspect }) {
  const inputRef = useRef(null);
  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(url);
  };

  return (
    <div
      className={styles.imageDrop}
      style={aspect ? { aspectRatio: aspect } : undefined}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <img src={value} alt={label || 'preview'} />
      ) : (
        <div className={styles.empty}>
          <Upload size={20} />
          <span>{label || 'Upload image'}</span>
        </div>
      )}
    </div>
  );
}
