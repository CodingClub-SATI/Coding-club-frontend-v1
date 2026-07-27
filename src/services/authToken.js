import { request } from './api';

const USERNAME_KEY = 'admin_username';

export function getUsername() {
  return localStorage.getItem(USERNAME_KEY);
}

export function setSession(token, username) {
  if (username) localStorage.setItem(USERNAME_KEY, username);
}

export async function clearSession() {
  localStorage.removeItem(USERNAME_KEY);
  try {
      await request('/api/auth/logout', { method: 'POST' });
  } catch (err) {
      console.error("Failed to clear cookie:", err);
  }
}