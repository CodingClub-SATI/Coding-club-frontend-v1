import { request } from '@/services/api';

export const settingsApi = {
  requestPasswordOtp: () => request('/api/auth/password/otp', { method: 'POST' }),
  updatePassword: ({ currentPassword, newPassword, otp }) =>
    request('/api/auth/password', { method: 'PUT', body: { currentPassword, newPassword, otp } }),
};

export const contactInfoApi = {
  get: () => request('/api/contact-info'),
  update: (payload) => request('/api/contact-info', { method: 'PUT', body: payload }),
};

export async function contactInfoLoader() {
  try {
    const contactInfo = await contactInfoApi.get();
    return { contactInfo, error: null };
  } catch (err) {
    console.error('Failed to load contact info:', err);
    return { contactInfo: null, error: 'Could not load contact info right now.' };
  }
}