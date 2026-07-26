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

// Route guard for /admin (see router/index.jsx and
// components/admin/ProtectedRoute.jsx). Runs before any admin route
// renders and confirms the stored token is still valid with the backend,
// rather than just trusting that it's present — an expired or revoked
// session is caught here instead of on whatever admin action happens to
// hit the API first.
export async function requireAuthLoader() {
  try {
    await authApi.verifySession();
    return null;
  } catch {
    clearSession();
    throw redirect('/admin/login');
  }
}
