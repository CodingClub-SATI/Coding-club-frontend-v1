export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_IMAGE_ACCEPT = ALLOWED_IMAGE_TYPES.join(',');

export function validateImageFile(file) {
  if (!file) return 'No file selected.';
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Unsupported file type. Please use JPEG, PNG, WEBP, or GIF.';
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'Image is too large. Maximum size is 2MB.';
  }
  return null;
}
