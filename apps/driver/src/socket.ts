import { Driver, DriverOrder, OrderChatMessage, OrderStatus, PassengerOrder } from '@packages/shared';
import { io } from 'socket.io-client';
import { orderToDriverOrder, store } from './store';

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

  if (store.screen === 'form') {
    const order = store.activeOrders.find((o) => o.id === store.screenFormData?.id);
    if (order) store.setScreenFormData(order);
    else store.openOrdersList();
  }
});

socket.on('driver:orders', (orders: DriverOrder[]) => {
  store.setAssignedOrders(orders);

  if (store.screen === 'form') {
    const order = store.assignedOrders.find((o) => o.id === store.screenFormData?.id);
    if (order) store.setScreenFormData(order);
    else store.openOrdersList();
  }
});

socket.on('driver:order:messages', (orderId: number, messages: OrderChatMessage[]) => {
  // свои сообщения
  if (store.screenFormData?.id === orderId) {
    store.setOrderMessages(messages);
  }
});

socket.on('passenger:order:messages', (orderId: number, messages: OrderChatMessage[]) => {
  // сообщения от пассажира
  const order = store.assignedOrders.find((o) => o.id === orderId);
  if (order) {
    const isCurrentOrderOpen = store.screen === 'form' && store.screenFormData?.id === orderId;
    if (isCurrentOrderOpen) store.setOrderMessages(messages);
    else store.openOrderForm(order);
  }
});
