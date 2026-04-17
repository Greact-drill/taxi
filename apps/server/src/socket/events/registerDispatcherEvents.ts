import type { Server as SocketIOServer } from 'socket.io';
import { type SocketRuntimeContext } from '../SocketRuntime.js';
import type { DispatcherConnectionsItem } from '@packages/shared';

async function getConnections(io: SocketIOServer): Promise<DispatcherConnectionsItem[]> {
  const sockets = await io.fetchSockets();
  const items: DispatcherConnectionsItem[] = sockets.map((s) => {
    const role = s.handshake.auth?.role;
    const token = s.handshake.auth?.token;
    return {
      role: typeof role === 'string' ? role : 'unknown',
      token: typeof token === 'string' ? token : undefined,
    };
  });
  return items;
}

export function registerDispatcherEvents(ctx: SocketRuntimeContext): void {
  // connect and disconnect events (dispatcher connections count)
  (async () => {
    const items = await getConnections(ctx.io);
    ctx.send('dispatcher', 'dispatcher:connections', items);
  })();

  ctx.socket.on('disconnect', async () => {
    const items = await getConnections(ctx.io);
    ctx.send('dispatcher', 'dispatcher:connections', items);
  });

  // TODO: dispatcher orders events
}

