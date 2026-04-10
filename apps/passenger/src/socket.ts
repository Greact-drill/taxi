import { io } from 'socket.io-client';
import { store } from './store';
import type { Passenger, PassengerOrder } from '@packages/shared';

export const socket = io({
  path: '/ws',
  autoConnect: true,
  auth: (callback) => {
    callback({
      role: 'passenger',
      token: store.token,
    });
  },
});

socket.on('connect', () => {
  store.setOnline(true);
  socket.emit('passenger:auth:request');
});

socket.on('disconnect', () => {
  store.setOnline(false);
});

export function setTokenReconnect(token: string): void {
  store.setToken(token);
  socket.disconnect();
  socket.connect();
}

export function clearTokenReconnect(): void {
  store.clearToken();
  socket.disconnect();
  socket.connect();
}

socket.on('error', (message: string) => {
  store.setError(message);
});

socket.on('auth:token', (token: string) => {
  setTokenReconnect(token);
});

socket.on('auth:profile', (user?: Passenger) => {
  if (user) store.setCurrentUser(user);
  else store.clearCurrentUser();
});

socket.on('passenger:profile', (user: Passenger) => {
  store.setCurrentUser(user);
});

socket.on('passenger:orders', (orders: PassengerOrder[]) => {
  store.setOrders(orders);
  store.openOrdersList();
});
