import { io } from 'socket.io-client';

function getPassengerId(): string {
  let id = sessionStorage.getItem('passengerId');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('passengerId', id);
  }
  return id;
}

export const socket = io('http://localhost:3001', {
  autoConnect: true,
  auth: {
    role: 'passenger' as const,
    clientId: getPassengerId(),
  },
});
