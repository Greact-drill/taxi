import { createServer } from 'node:http';
import { getServerPort } from './db/config.js';
import { prisma } from './db/prisma.js';
import { createSocketServer } from './socket/SocketServer.js';

const PORT = getServerPort();

const httpServer = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200).end('ok');
    return;
  }
  res.writeHead(404).end();
});

async function main(): Promise<void> {
  await prisma.$connect();
  await createSocketServer(httpServer, prisma);
  httpServer.listen(PORT, () => {
    console.log(`Socket.IO server on :${PORT}`);
  });
}

void main();
