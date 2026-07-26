// Shared API client. Base URL comes from the environment so dev/staging/prod
// can each point at a different backend without touching code.
// Set VITE_API_BASE_URL in a local .env file (see .env.example).
import { getToken, clearSession } from './authToken';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Thrown for any non-2xx response so callers can branch on `.status`
// (e.g. show "invalid credentials" for 401 vs a generic message for 500)
// instead of parsing a status code out of a plain Error's message.
export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export async function request(path, { body, headers = {}, ...options } = {}) {
  const token = getToken();

  // TODO(auth): if this project switches to HttpOnly cookie sessions (see
  // TODO in ./authToken.js), replace this Authorization header with
  // `credentials: 'include'` on the fetch call below.
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // A 401 on anything other than the auth endpoints themselves means the
  // token we sent is missing, expired, or revoked. No retry fixes that, so
  // clear it and send the admin back to login instead of leaving them on a
  // broken page. (Login/verify handle their own 401s explicitly — see
  // features/auth/admin/Login.jsx and components/admin/ProtectedRoute.jsx.)
  if (res.status === 401 && !path.startsWith('/api/auth/')) {
    clearSession();
    window.location.assign('/admin/login');
  }

  // Responses can be empty (e.g. a 204 on delete), so parse defensively
  // instead of assuming res.json() always succeeds.
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message = (data && data.message) || `Request to ${path} failed with status ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  return data;
}

export const statsApi = {
  get: () => request('/api/stats'),
};
