import { createServer } from 'node:http';
import { Server } from 'socket.io';
import type { ConnectionInfo } from '@packages/shared';

const PORT = 3001;

const httpServer = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200).end('ok');
    return;
  }
  res.writeHead(404).end();
});

const io = new Server(httpServer, {
  path: '/ws',
  pingInterval: 1000,
  pingTimeout: 1000,
});

async function emitConnections(): Promise<void> {
  const sockets = await io.fetchSockets();
  const list: ConnectionInfo[] = [];
  for (const s of sockets) {
    const { role, token } = s.handshake.auth;
    list.push({ role, token });
  }
  io.to('role:dispatcher').emit('connections', list);
}

io.on('connection', (socket) => {
  const { role, token } = socket.handshake.auth;

  socket.join(`role:${role}`);
  socket.join(`token:${token}`);

  void emitConnections();

  socket.on('disconnect', () => {
    void emitConnections();
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server on :${PORT}`);
});
