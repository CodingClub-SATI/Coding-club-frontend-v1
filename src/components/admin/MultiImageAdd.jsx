import { useRef } from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/shared/Button';

export default function MultiImageAdd({ onAdd, disabled = false }) {
  const inputRef = useRef(null);
  const handleFiles = (files) => {
    const photos = Array.from(files);
    if (photos.length) onAdd(photos);
  };
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        disabled={disabled}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <Button variant="outline" onClick={() => inputRef.current?.click()} disabled={disabled} isLoading={disabled}>
        <Plus size={16} /> {disabled ? 'Uploading…' : 'Add Photos'}
      </Button>
    </>
  );
}
