import { io } from 'socket.io-client';

export const socket = io({
  path: '/ws',
  autoConnect: true,
  auth: {
    role: 'dispatcher',
    token: '1234567890',
  },
});
