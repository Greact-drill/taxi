import { io } from 'socket.io-client';
import { store } from './store';
import type { DriverOrder, OrderChatMessage, Passenger, PassengerOrder } from '@packages/shared';

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

  if (store.screen === 'form') {
    const order = orders.find((o) => o.id === store.screenFormData?.id);
    if (order) store.setScreenFormData(order);
    else store.openOrdersList(); // screenForm 'new' или удален
  }
});

socket.on('passenger:order:messages', (orderId: number, messages: OrderChatMessage[]) => {
  // мои сообщения
  if (store.screenFormData?.id === orderId) {
    store.setOrderMessages(messages);
  }
});

socket.on('driver:order:messages', (orderId: number, messages: OrderChatMessage[]) => {
  // сообщения водителя
  const order = store.orders.find((o) => o.id === orderId);
  if (order) {
    const isCurrentOrderOpen = store.screen === 'form' && store.screenForm === 'edit' && store.screenFormData?.id === orderId;
    if (isCurrentOrderOpen) store.setOrderMessages(messages);
    else store.openEditOrderForm(order);
  }
});

socket.on('server:online:request', () => {
  console.log('server:online:request', `passenger:${store.currentUser?.id}`);
  socket.emit('server:online', `passenger:${store.currentUser?.id}`);
});
