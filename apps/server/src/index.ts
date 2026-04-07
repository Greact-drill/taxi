import { createServer } from 'node:http';
import { Server } from 'socket.io';
import type { ClientRole, ConnectionInfo } from '@poc/shared';

const PORT = 3001;

/** Tracks which Socket.IO instance owns the row (stable clientId vs reconnect race). */
type TrackedConnection = ConnectionInfo & { socketId: string };

const httpServer = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200).end('ok');
    return;
  }
  res.writeHead(404).end();
});

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
  },
  pingInterval: 1000,
  pingTimeout: 1000,
});

const connections = new Map<string, TrackedConnection>();

function emitConnections(): void {
  const list: ConnectionInfo[] = Array.from(connections.values()).map(
    ({ clientId, role }) => ({ clientId, role }),
  );
  io.to('dispatchers').emit('connections', list);
}

io.on('connection', (socket) => {
  const role = socket.handshake.auth.role as ClientRole | undefined;

  if (role !== 'passenger' && role !== 'dispatcher') {
    socket.disconnect(true);
    return;
  }

  const rawClientId = socket.handshake.auth.clientId;
  const clientId =
    typeof rawClientId === 'string' && rawClientId.length > 0
      ? rawClientId
      : socket.id;

  connections.set(clientId, { clientId, role, socketId: socket.id });

  if (role === 'dispatcher') {
    socket.join('dispatchers');
  }

  emitConnections();

  socket.on('disconnect', () => {
    const row = connections.get(clientId);
    if (row?.socketId === socket.id) {
      connections.delete(clientId);
      emitConnections();
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server on :${PORT}`);
});
