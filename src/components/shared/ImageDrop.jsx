import { useEffect, useRef, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { uploadImage } from '@/services/upload';
import { ALLOWED_IMAGE_ACCEPT } from '@/utils/imageValidation';
import Spinner from './Spinner';
import styles from './ImageDrop.module.css';

export default function ImageDrop({ value, onChange, label, aspect, onUploadingChange }) {
  const createdUrlRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // Revoke the blob URL once the real hosted URL comes back and takes
  // over as `value`, and on unmount — otherwise it leaks memory.
  useEffect(() => {
    if (createdUrlRef.current && value && value !== createdUrlRef.current) {
      URL.revokeObjectURL(createdUrlRef.current);
      createdUrlRef.current = null;
      setPreviewUrl(null);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (createdUrlRef.current) URL.revokeObjectURL(createdUrlRef.current);
    };
  }, []);

  const handleFile = async (file) => {
    if (!file) return;
    setError(null);

    if (createdUrlRef.current) URL.revokeObjectURL(createdUrlRef.current);
    const localUrl = URL.createObjectURL(file);
    createdUrlRef.current = localUrl;
    setPreviewUrl(localUrl);
    setIsUploading(true);
    onUploadingChange?.(true);

    try {
      const hostedUrl = await uploadImage(file);
      onChange(hostedUrl);
    } catch (err) {
      console.error('Image upload failed:', err);
      setError(err.message || 'Upload failed. Try a different image.');
      if (createdUrlRef.current) {
        URL.revokeObjectURL(createdUrlRef.current);
        createdUrlRef.current = null;
      }
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
    }
  };

  const displaySrc = previewUrl || value;

  return (
    <div>
      <label
        className={styles.imageDrop}
        style={aspect ? { aspectRatio: aspect } : undefined}
      >
        <input
          type="file"
          accept={ALLOWED_IMAGE_ACCEPT}
          hidden
          disabled={isUploading}
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        {displaySrc ? (
          <img src={displaySrc} alt={label || 'preview'} />
        ) : (
          <div className={styles.empty}>
            <Upload size={20} aria-hidden="true" />
            <span>{label || 'Upload image'}</span>
          </div>
        )}
        {isUploading && (
          <div className={styles.uploadingOverlay}>
            <Spinner />
          </div>
        )}
      </label>
      {error && (
        <p className={styles.error} role="alert">
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
