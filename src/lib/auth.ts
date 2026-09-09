// src/lib/auth.ts
//
// Single source of truth for reading/writing the customer auth token.
// Centralizing this (instead of scattering localStorage.getItem("auth_token")
// calls across Header/Login/axios/etc, as this project previously did — and
// in one leftover spot, checking a different, never-set "token" key) removes
// an entire class of "logged in per one check but not per another" bugs.
//
// IMPORTANT SECURITY NOTE — please read before shipping this to production:
// This backend issues a Bearer token in the JSON login response (not a
// server-set httpOnly cookie), so the token has to live somewhere JavaScript
// can read it in order to attach it to API requests. That means it is,
// unavoidably, readable by any script that runs in this page - including an
// injected one, if this app ever has an XSS bug. localStorage and
// non-httpOnly cookies are equally exposed here; neither is meaningfully
// safer than the other against that threat.
//
// The only way to make the token truly unreadable to JavaScript (and so
// immune to sniffing/exfiltration via XSS) is for the backend to issue it as
// an httpOnly, Secure, SameSite=strict cookie instead of a JSON field - e.g.
// Laravel Sanctum's SPA "cookie" authentication mode. That is a backend
// change, not something this frontend can force on its own. Until that's in
// place, what this module *does* do is:
//   - keep the token out of the URL, query strings, and page markup
//   - never log it or send it to any host other than the configured API
//   - clear it immediately and everywhere on logout or a 401
//   - pair with a strict Content-Security-Policy (see index.html) to make
//     the XSS that would be required to steal it much harder to pull off
//     in the first place
const TOKEN_KEY = "auth_token";
const LEGACY_KEYS = ["token"]; // old/inconsistent keys seen elsewhere in this app - cleaned up on read

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
