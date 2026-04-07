import { io } from 'socket.io-client';

export const socket = io({
  path: '/ws',
  autoConnect: true,
  auth: {
    role: 'passenger',
    token: '0987654321',
  },
});
