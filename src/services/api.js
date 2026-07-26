// Shared API client. Base URL comes from the environment so dev/staging/prod
// can each point at a different backend without touching code.
// Set VITE_API_BASE_URL in a local .env file (see .env.example).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function request(path, options = {}) {
  let res;

  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  } catch (error) {
    throw new Error(`Network error: ${error.message}`);
  }

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const statsApi = {
  get: () => request('/api/stats'),
};
