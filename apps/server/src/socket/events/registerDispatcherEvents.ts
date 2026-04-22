import type { Server as SocketIOServer } from 'socket.io';
import { type SocketRuntimeContext } from '../SocketRuntime.js';
import type { DispatcherConnectionsItem, Driver } from '@packages/shared';

const ONLINE_TIMEOUT = 20_000;

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

  (async () => {
    let id: string | undefined;
    if (ctx.socket.data.driver) {
      id = `driver:${ctx.socket.data.driver.id}`;
    } else if (ctx.socket.data.passenger) {
      id = `passenger:${ctx.socket.data.passenger.id}`;
    }
    if (id) {
      // TODO проверить, что это прервт проверку на оффла при перезагрузке клиента
      ctx.statusMap[id] = 'online';
      ctx.send('dispatcher', 'dispatcher:status:change', id, 'online');
    }
  })();

  ctx.socket.on('disconnect', async () => {
    let id: string | undefined;
    if (ctx.socket.data.driver) {
      id = `driver:${ctx.socket.data.driver.id}`;
    } else if (ctx.socket.data.passenger) {
      id = `passenger:${ctx.socket.data.passenger.id}`;
    }
    if (id) {
      ctx.statusMap[id] = 'checking';
      ctx.send(id, 'server:online:request');
      ctx.timeout(ONLINE_TIMEOUT, async () => {
        if (ctx.statusMap[id] === 'checking') {
          ctx.statusMap[id] = 'offline';
          ctx.send('dispatcher', 'dispatcher:status:change', id, 'offline');
        }
      });
    }
  });

  ctx.on('server:online', async (id: number) => {
    ctx.statusMap[id] = 'online';
    ctx.send('dispatcher', 'dispatcher:status:change', id, 'online');
  });

  ctx.on('dispatcher:status:map:request', async () => {
    ctx.socket.emit('dispatcher:status:map', ctx.statusMap);
    ctx.send('driver', 'server:online:request');
    ctx.send('passenger', 'server:online:request');
  });

  ctx.on('dispatcher:drivers:request', async () => {
    ctx.socket.emit('dispatcher:drivers', await ctx.driverService.list());
  });

  ctx.on('dispatcher:passengers:request', async () => {
    ctx.socket.emit('dispatcher:passengers', await ctx.passengerService.list());
  });

  ctx.on('dispatcher:orders:request', async () => {
    ctx.socket.emit('dispatcher:orders', await ctx.orderService.list());
  });

  ctx.on(
    'dispatcher:drivers:update',
    async (id: number, patch: Partial<Driver>) => {
      const result = await ctx.driverService.update(id, patch);
      ctx.send('dispatcher', 'dispatcher:drivers', await ctx.driverService.list());
      ctx.send(`driver:${id}`, 'driver:profile', result);
    },
  );

  ctx.on('dispatcher:drivers:delete', async (id: number) => {
    await ctx.driverService.remove(id);
    ctx.send(`driver:${id}`, 'auth:reconnect');
    ctx.send('dispatcher', 'dispatcher:drivers', await ctx.driverService.list());
  });

  ctx.on('dispatcher:drivers:password', async (id: number, newPassword: string) => {
    await ctx.driverService.setPassword(id, newPassword);
    ctx.send(`driver:${id}`, 'auth:reconnect');
    ctx.send('dispatcher', 'dispatcher:drivers', await ctx.driverService.list());
  });
}

