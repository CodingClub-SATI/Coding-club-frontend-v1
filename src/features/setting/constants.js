export const PASSWORD_MIN_LENGTH = 8;
export const OTP_LENGTH = 6;
export const OTP_RESEND_SECONDS = 60;
export const MIN_STRENGTH_SCORE = 3;

const STRENGTH_LEVELS = [
  { label: 'Too Short', tone: 'weak' },
  { label: 'Weak', tone: 'weak' },
  { label: 'Fair', tone: 'fair' },
  { label: 'Good', tone: 'fair' },
  { label: 'Strong', tone: 'strong' },
  { label: 'Very Strong', tone: 'strong' },
];

export function getPasswordStrength(password) {
  if (!password) return { score: 0, ...STRENGTH_LEVELS[0] };

  let score = 0;
  if (password.length >= PASSWORD_MIN_LENGTH) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  return { score, ...STRENGTH_LEVELS[score] };
}
