import { request } from '@/services/api';

// Namespaced under /api/auth rather than /api/admin: the shared request()
// wrapper skips its auto-logout-on-401 redirect for /api/auth/* paths, which
// matters here since a wrong current password legitimately returns 401 and
// should surface as a form error, not boot the admin back to the login page.
export const settingsApi = {
  requestPasswordOtp: () => request('/api/auth/password/otp', { method: 'POST' }),
  updatePassword: ({ currentPassword, newPassword, otp }) =>
    request('/api/auth/password', { method: 'PUT', body: { currentPassword, newPassword, otp } }),
};

// Site info API endpoints
export const siteInfoApi = {
  get: () => request('/api/site-info'),
  update: (payload) => request('/api/site-info', { method: 'PUT', body: payload }),
};

// Loader used by the router for both public and admin layouts
export async function siteInfoLoader() {
  try {
    const siteInfo = await siteInfoApi.get();
    return { siteInfo, error: null };
  } catch (err) {
    console.error('Failed to load site info:', err);
    return { siteInfo: null, error: 'Could not load site info right now.' };
  }
}
