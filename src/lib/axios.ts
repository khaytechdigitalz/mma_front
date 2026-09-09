import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getAuthToken, clearAuthToken, isAuthenticated } from '@/lib/auth';

const API_BASE_URL = import.meta.env.NEXT_PUBLIC_API_BASE_URL as string;

// Get or create a persistent guest token in localStorage (used for guest
// cart/wishlist continuity before login - not a substitute for auth).
let guestToken = localStorage.getItem('guest_token');
if (!guestToken) {
  guestToken = crypto.randomUUID();
  localStorage.setItem('guest_token', guestToken);
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Guest-Token': guestToken,
  },
  timeout: 15000,
});

// Request Interceptor: Attach Auth Bearer Token
// Only ever attached to this one apiClient instance (not the global axios
// object), so the token is never sent to any third-party host this app
// might call for something unrelated (e.g. an image or map SDK).
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response Interceptor: Global Error & Auth Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        // Only treat this as "your session expired" (and bounce to login) if
        // we actually had a token - a 401 on a public/guest endpoint isn't a
        // logout event.
        const hadToken = isAuthenticated();
        clearAuthToken();
        if (hadToken && typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = `/login?expired=1&from=${encodeURIComponent(window.location.pathname)}`;
        }
      }

      if (status === 403) {
        console.warn('Access denied: You do not have the required permissions.');
      }
    }

    return Promise.reject(error);
  },
);
