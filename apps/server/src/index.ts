import "dotenv/config";
import { createServer } from 'node:http';
import { createServices } from './services/index';
import { createSocketServer } from './socket/SocketServer';

const PORT = 3001;

const httpServer = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200).end('ok');
    return;
  }
  res.writeHead(404).end();
});

async function main(): Promise<void> {
  const services = await createServices(); 
  await createSocketServer(httpServer, services);
  httpServer.listen(PORT, () => {
    console.log(`Socket.IO server on :${PORT}`);
  });
}

void main();
