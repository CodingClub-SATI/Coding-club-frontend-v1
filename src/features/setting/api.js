import { request } from '@/services/api';

export const settingsApi = {
  requestPasswordOtp: () => request('/api/auth/password/otp', { method: 'POST' }),
  updatePassword: ({ currentPassword, newPassword, otp }) =>
    request('/api/auth/password', { method: 'PUT', body: { currentPassword, newPassword, otp } }),
};

export const siteInfoApi = {
  get: () => request('/api/site-info'),
  update: (payload) => request('/api/site-info', { method: 'PUT', body: payload }),
};

export async function siteInfoLoader() {
  try {
    const siteInfo = await siteInfoApi.get();
    return { siteInfo, error: null };
  } catch (err) {
    console.error('Failed to load site info:', err);
    return { siteInfo: null, error: 'Could not load site info right now.' };
  }
}