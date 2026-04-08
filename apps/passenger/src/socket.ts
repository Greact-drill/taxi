import { io } from 'socket.io-client';

const TOKEN_STORAGE_KEY = 'taxi_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export const socket = io({
  path: '/ws',
  autoConnect: true,
  auth: {
    role: 'passenger',
    token: getStoredToken() ?? undefined,
  },
});
