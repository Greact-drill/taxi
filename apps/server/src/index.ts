import { createServer } from 'node:http';
import { createSocketServer } from './socket/SocketServer.js';

const PORT = 3001;

const httpServer = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200).end('ok');
    return;
  }
  res.writeHead(404).end();
});

async function main(): Promise<void> {
  await createSocketServer(httpServer);
  httpServer.listen(PORT, () => {
    console.log(`Socket.IO server on :${PORT}`);
  });
}

void main();
