import { type SocketRuntimeContext } from '../SocketRuntime.js';
import type {
  Driver,
  DriverCreateInput,
  DriverOrder,
  Passenger,
  PassengerOrder,
} from '@packages/shared';

const ONLINE_TIMEOUT = 20_000;

export function registerDispatcherEvents(ctx: SocketRuntimeContext): void {

  // online status map
  (async () => {
    let id: string | undefined;
    if (ctx.socket.data.driver) {
      id = `driver:${ctx.socket.data.driver.id}`;
    } else if (ctx.socket.data.passenger) {
      id = `passenger:${ctx.socket.data.passenger.id}`;
    }
    if (id) {
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
    ctx.statusMap = {};
    ctx.send('driver', 'server:online:request');
    ctx.send('passenger', 'server:online:request');
  });

  // columns data requests
  ctx.on('dispatcher:drivers:request', async () => {
    ctx.socket.emit('dispatcher:drivers', await ctx.driverService.list());
  });

  ctx.on('dispatcher:passengers:request', async () => {
    ctx.socket.emit('dispatcher:passengers', await ctx.passengerService.list());
  });

  ctx.on('dispatcher:orders:request', async () => {
    ctx.socket.emit('dispatcher:orders', await ctx.orderService.list());
  });

  // orders management events
  ctx.on('dispatcher:orders:update', async (id: number, input: Partial<PassengerOrder> | Partial<DriverOrder>) => {
    await ctx.orderService.update(id, input);
    ctx.send('dispatcher', 'dispatcher:orders', await ctx.orderService.list());
  });

  ctx.on('dispatcher:orders:delete', async (id: number) => {
    await ctx.orderService.delete(id);
    ctx.send('dispatcher', 'dispatcher:orders', await ctx.orderService.list());
  });

  // drivers management events
  ctx.on('dispatcher:drivers:create', async (input: DriverCreateInput) => {
    await ctx.driverService.create(input);
    ctx.send('dispatcher', 'dispatcher:drivers', await ctx.driverService.list());
  });

  ctx.on('dispatcher:drivers:update', async (id: number, input: Partial<Driver>) => {
    const result = await ctx.driverService.update(id, input);
    ctx.send('dispatcher', 'dispatcher:drivers', await ctx.driverService.list());
    ctx.send(`driver:${id}`, 'driver:profile', result);
    // TOOD уведомить так же пассажиров, которые имеют активные заказы с этим водителем
    // TODO обновить список заказов и у самого диспетчера
  });

  ctx.on('dispatcher:drivers:password', async (id: number, newPassword: string) => {
    await ctx.driverService.setPassword(id, newPassword);
    ctx.send(`driver:${id}`, 'auth:reconnect');
    ctx.send('dispatcher', 'dispatcher:drivers', await ctx.driverService.list());
  });

  ctx.on('dispatcher:drivers:delete', async (id: number) => {
    await ctx.driverService.remove(id);
    ctx.send(`driver:${id}`, 'auth:reconnect');
    ctx.send('dispatcher', 'dispatcher:drivers', await ctx.driverService.list());
  });

  // passengers management events
  ctx.on('dispatcher:passengers:update', async (id: number, input: Partial<Passenger>) => {
    const result = await ctx.passengerService.update(id, input);
    ctx.send('dispatcher', 'dispatcher:passengers', await ctx.passengerService.list());
    ctx.send(`passenger:${id}`, 'passenger:profile', result);
    // TODO уведомить так же водителей, которые имеют активные заказы с этим пассажиром
    // TODO обновить список заказов и у самого диспетчера
  });

  ctx.on('dispatcher:passengers:delete', async (id: number) => {
    await ctx.passengerService.remove(id);
    ctx.send(`passenger:${id}`, 'auth:reconnect');
    ctx.send('dispatcher', 'dispatcher:passengers', await ctx.passengerService.list());
  });

}

