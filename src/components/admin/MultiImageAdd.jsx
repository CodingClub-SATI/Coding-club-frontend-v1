import { useRef } from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/shared/Button';

export default function MultiImageAdd({ onAdd }) {
  const inputRef = useRef(null);
  const handleFiles = (files) => {
    const photos = Array.from(files).map(f => ({ src: URL.createObjectURL(f), caption: f.name.replace(/\.[^.]+$/, '') }));
    if (photos.length) onAdd(photos);
  };
  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
      <Button variant="outline" onClick={() => inputRef.current?.click()}>
        <Plus size={16} /> Add Photos
      </Button>
    </>
  );
}
