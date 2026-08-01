import { redirect } from 'react-router';
import { request } from '@/services/api';
import { clearSession } from '@/services/authToken';

export const authApi = {
  login: (username, password) =>
    request('/api/auth/login', { method: 'POST', body: { username, password } }),
  verifySession: () => request('/api/auth/verify'),
};

export async function requireAuthLoader() {
  try {
    await authApi.verifySession();
    return null;
  } catch {
    clearSession();
    throw redirect('/admin/login');
  }
}
