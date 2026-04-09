import { io } from 'socket.io-client';
import { store } from './store';
import { Passenger, PassengerOrder } from '@packages/shared';

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

socket.on('connect', async () => {
  store.setOnline(true);
  socket.emit('me:request')
});

socket.on('disconnect', () => {
  store.setOnline(false);
});

socket.on('profile:update', (user: Passenger) => {
  store.setCurrentUser(user);
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

socket.on('passenger:orders', (orders: PassengerOrder[]) => {
  store.setOrders(orders);
});
