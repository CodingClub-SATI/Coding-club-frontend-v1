import { request } from './api';

const USERNAME_KEY = 'admin_username';
const TOKEN_KEY = 'admin_token';

export function getUsername() {
  return localStorage.getItem(USERNAME_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token, username) {
  if (username) localStorage.setItem(USERNAME_KEY, username);
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export async function clearSession() {
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(TOKEN_KEY);
  try {
      await request('/api/auth/logout', { method: 'POST' });
  } catch (err) {
      console.error("Failed to clear session:", err);
  }
}