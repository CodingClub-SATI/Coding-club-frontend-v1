// Centralizes how the admin session (auth token + a display-only username)
// is persisted, so nothing else in the app touches localStorage directly
// for auth. If storage ever needs to change (e.g. to a cookie), this is the
// only file that has to change.
//
// TODO(auth): confirm with backend whether /api/auth/login can set the
// session as an HttpOnly cookie instead of returning a token in the JSON
// body. If so, switch this file to a no-op (cookies aren't readable from
// JS anyway) and update src/services/api.js to send
// `credentials: 'include'` instead of attaching an Authorization header.
// HttpOnly cookies are immune to XSS-based token theft, which the current
// localStorage approach is not — see conversation from 2026-07-27.

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
