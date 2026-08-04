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

/**
 * Best-effort cleanup for image fields that got replaced or cleared during
 * an edit. The generic upload/PUT flow (services/upload.js + a plain
 * PUT .../:id) has no server-side hook to delete an old Catbox file when a
 * new one takes its place — unlike the dedicated per-model upload routes
 * (e.g. POST /api/upload/event/:id/:asset), which aren't wired up on the
 * frontend. This closes the same gap without switching to that pipeline,
 * so save/cancel semantics stay exactly as they are today (nothing is
 * committed until the record itself is actually saved).
 *
 * Never throws — a failed cleanup delete shouldn't be treated as a failed
 * save; the save already succeeded by the time this runs.
 *
 *   cleanupReplacedImages(originalEvent, savedEvent, ['bannerUrl', 'logoUrl']);
 */
export async function cleanupReplacedImages(before, after, fields) {
  if (!before) return; // create flow — there's no "old" image to clean up
  await Promise.all(
    fields.map((field) => {
      const oldUrl = before[field];
      const newUrl = after?.[field];
      if (!oldUrl || oldUrl === newUrl) return null;
      return deleteImage(oldUrl).catch((err) => {
        console.error(`Failed to clean up replaced image (${field}):`, err);
      });
    })
  );
}