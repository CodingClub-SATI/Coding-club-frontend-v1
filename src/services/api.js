// Set VITE_API_BASE_URL in a local .env file (see .env.example).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function request(path, options = {}) {
  const { body, headers, ...rest } = options;
  const jsonBody = body !== undefined && typeof body !== 'string' ? JSON.stringify(body) : body;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...headers },
    body: jsonBody,
    ...rest,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `API request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const statsApi = {
  get: () => request('/api/stats'),
};
