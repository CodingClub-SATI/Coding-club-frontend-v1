import { ApiError, request } from './api';
import { validateImageFile } from '@/utils/imageValidation';

const UPLOAD_PATH = '/api/upload';

export async function uploadImage(file) {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new ApiError(validationError, 400, null);
  }

  const formData = new FormData();
  formData.append('image', file);

  const data = await request(UPLOAD_PATH, { method: 'POST', body: formData });

  if (!data?.url) {
    throw new ApiError('Upload succeeded but no URL was returned.', 200, data);
  }

  return data.url;
}

export async function deleteImage(url) {
  if (!url) return;
  
  return request(UPLOAD_PATH, {
    method: 'DELETE',
    body: { url }
  });
}