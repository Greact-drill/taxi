import { Driver, DriverOrder, Order, OrderStatus } from '@packages/shared';
import { io } from 'socket.io-client';
import { orderToDriverOrder, store } from './store';

export const socket = io({
  path: '/ws',
  autoConnect: true,
  auth: (callback) => {
    callback({
      role: 'driver',
      token: store.token,
    });
  },
});

socket.on('connect', () => {
  store.setOnline(true);
  socket.emit('driver:auth:request');
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
  store.clearCurrentUser();
  socket.disconnect();
  socket.connect();
}

socket.on('error', (message: string) => {
  store.setError(message);
});

socket.on('auth:token', (token: string) => {
  setTokenReconnect(token);
});

socket.on('auth:profile', (user: Driver) => {
  store.setCurrentUser(user);
});

socket.on('driver:orders:active', (orders: DriverOrder[]) => {
  store.setActiveOrders(orders);
  if (store.screen === 'form' &&
    store.screenFormData &&
    store.screenFormData.status === OrderStatus.AWAITING_DRIVER) {
    const data = store.activeOrders.find((order) => order.id === store.screenFormData!.id);
    if (data) store.openOrderForm(data);
    else store.openOrdersList();
  }
});

socket.on('driver:orders', (orders: DriverOrder[]) => {
  store.setAssignedOrders(orders);
  store.openOrdersList();
});
