import { ApiError, request } from './api';
import { clearSession } from './authToken';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const UPLOAD_PATH = '/api/upload';

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE_URL}${UPLOAD_PATH}`, {
    method: 'POST',
    credentials: 'include', // Automatically sends the HttpOnly JWT cookie
    body: formData,
  });

  if (res.status === 401) {
    await clearSession();
    window.location.assign('/admin/login');
  }

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message = (data && data.message) || `Image upload failed with status ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  if (!data?.url) {
    throw new ApiError('Upload succeeded but no URL was returned.', res.status, data);
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