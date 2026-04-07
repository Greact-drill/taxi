import { io } from 'socket.io-client';

export const socket = io('http://localhost:3001', {
  autoConnect: true,
  auth: {
    role: 'dispatcher',
    token: '1234567890',
  },
});
