import { io } from 'socket.io-client';

function getDispatcherId(): string {
  let id = sessionStorage.getItem('dispatcherId');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('dispatcherId', id);
  }
  return id;
}

export const socket = io('http://localhost:3001', {
  autoConnect: true,
  auth: {
    role: 'dispatcher' as const,
    clientId: getDispatcherId(),
  },
});
