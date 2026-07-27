import { redirect } from 'react-router';
import { request } from '@/services/api';
import { clearSession } from '@/services/authToken';

export const authApi = {
  login: (username, password) =>
    request('/api/auth/login', { method: 'POST', body: { username, password } }),

  // Confirms the stored token is still valid. Called by requireAuthLoader
  // below on every navigation into the admin panel.
  verifySession: () => request('/api/auth/verify'),
};

// Route guard attached to the /admin route in router/index.jsx. Confirms
// the stored token is still valid with the backend rather than just
// trusting that it's present, so an expired or revoked session is caught
// before any admin route renders.
export async function requireAuthLoader() {
  try {
    await authApi.verifySession();
    return null;
  } catch {
    clearSession();
    throw redirect('/admin/login');
  }
}
