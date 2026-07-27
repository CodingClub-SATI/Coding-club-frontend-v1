import { ApiError } from './api';
import { clearSession } from './authToken';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// NOTE: This assumes a dedicated multipart upload endpoint that stores the
// file (e.g. to S3/Cloudinary/disk) and responds with { url }. That's the
// standard production pattern — the hosted URL is what actually gets saved
// on the resource (event.image, project.image, etc.), never the file
// itself. Update UPLOAD_PATH / the response shape below once the backend
// route is confirmed; every feature using <ImageDrop /> shares this one
// function, so it only needs changing in one place.
const UPLOAD_PATH = '/api/upload';

/**
 * Uploads a single image file and resolves to its hosted URL.
 * Kept separate from services/api.js's request() because this needs
 * multipart/form-data, not a JSON body.
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE_URL}${UPLOAD_PATH}`, {
    method: 'POST',
    credentials: 'include',
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
