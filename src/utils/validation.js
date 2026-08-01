export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const URL_PATTERN = /^https?:\/\/.+/i;

export function isValidUrl(value) {
  return URL_PATTERN.test(value);
}

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(value);
}
