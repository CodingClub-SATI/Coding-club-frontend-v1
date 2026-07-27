// Centralizes admin session storage so only this file touches localStorage
// for auth. If storage ever needs to change, this is the only file to update.
//
// TODO(auth): if the backend can set the session as an HttpOnly cookie
// instead of returning a token, switch this to a no-op and have
// src/services/api.js send credentials instead of an Authorization header —
// cookies are safer against XSS than localStorage.

const TOKEN_KEY = 'admin_token';
const USERNAME_KEY = 'admin_username';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Cosmetic only ("Logged in as ___" in the admin topbar) — never used for
// authorization, so it's fine that it's just whatever the admin typed in.
export function getUsername() {
  return localStorage.getItem(USERNAME_KEY);
}

export function setSession(token, username) {
  localStorage.setItem(TOKEN_KEY, token);
  if (username) localStorage.setItem(USERNAME_KEY, username);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}
