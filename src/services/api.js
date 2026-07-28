import { clearSession } from './authToken';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export async function request(path, { body, headers = {}, ...options } = {}) {
  // File uploads (e.g. gallery photos) pass a FormData body. Let the browser
  // set its own multipart Content-Type (with boundary) and send it as-is —
  // only plain objects get JSON-encoded.
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !path.startsWith('/api/auth/')) {
    await clearSession();
    window.location.assign('/admin/login');
  }

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