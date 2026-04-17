import type { Driver, Order, Passenger } from '@packages/shared';
import { io } from 'socket.io-client';
import { store } from './store';

export const socket = io({
  path: '/ws',
  autoConnect: true,

  // Reconnection: быстрый и настойчивый
  reconnection: true,
  reconnectionAttempts: Infinity,     // никогда не сдаваться
  reconnectionDelay: 1000,            // 1 с на первую попытку
  reconnectionDelayMax: 3000,         // не более 3 с между попытками
  randomizationFactor: 0.2,           // минимальный разброс

  auth: (callback) => {
    callback({
      role: 'dispatcher',
      token: store.token,
    });
  },
});

socket.on('connect', () => {
  store.setOnline(true);
  socket.emit('dispatcher:auth:request');
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

socket.on('dispatcher:drivers', (drivers: Driver[]) => {
  store.setDrivers(drivers);
});

socket.on('dispatcher:passengers', (passengers: Passenger[]) => {
  store.setPassengers(passengers);
});

socket.on('dispatcher:orders', (orders: Order[]) => {
  store.setOrders(orders);
});