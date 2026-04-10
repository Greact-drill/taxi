import type { Server as HttpServer } from 'node:http';
import { inspect } from 'node:util';
import { Server, Socket } from 'socket.io';
import { PassengerStore } from '../stores/PassengerStore.js';
import { DriverStore } from '../stores/DriverStore.js';
import { OrderStore } from '../stores/OrderStore.js';
import {
  OrderStatus,
  type DispatcherConnectionsItem,
  type Driver,
  type DriverLogin,
  type DriverOrder,
  type Passenger,
  type PassengerOrder,
  type PassengerRegister,
} from '@packages/shared';

export async function createSocketServer(httpServer: HttpServer): Promise<Server> {
  const io = new Server(httpServer, {
    path: '/ws',
    pingInterval: 1000,
    pingTimeout: 1000,
  });

  const passengerStore = new PassengerStore();
  const driverStore = new DriverStore();
  const orderStore = new OrderStore();

  async function getConnections(): Promise<DispatcherConnectionsItem[]> {
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

  io.use((socket, next) => {
    const role = socket.handshake.auth?.role;
    const token = socket.handshake.auth?.token;
    if (token) {
      if (role === 'passenger') {
        const passenger = passengerStore.findByToken(token);
        if (passenger) socket.data.passenger = passenger;
      } else if (role === 'driver') {
        const driver = driverStore.findByToken(token);
        if (driver) socket.data.driver = driver;
      }
    }
    next();
  });

  io.on('connection', (socket) => {

    const role = socket.handshake.auth?.role;
    if (!role || !['passenger', 'dispatcher', 'driver'].includes(role)) {
      socket.emit('error', `Role must be valid: ${role}`);
      return;
    };
    socket.join(role);

    const passenger = socket.data.passenger;
    if (passenger) {
      socket.join(`passenger:${passenger.id}`);
    }

    const driver = socket.data.driver;
    if (driver) {
      socket.join(`driver:${driver.id}`);
    }

    function requirePassenger(): Passenger {
      const passenger = socket.data.passenger;
      if (passenger) return passenger;
      else throw Error('Пассажир должен быть авторизован')
    }

    function requireDriver(): Driver {
      const driver = socket.data.driver;
      if (driver) return driver;
      else throw Error('Водитель должен быть авторизован')
    }

    function on<P extends unknown[]>(
      event: string,
      handler: (...args: P) => Promise<void>,
    ): void {
      socket.on(event, (...args: P) => {
        void handler(...args).catch((error: unknown) => {
          const message = error instanceof Error ? error.message : 'Unknown server error';
          if (error instanceof Error) {
            console.error(error.stack ?? `${error.name}: ${error.message}`);
            if (error.cause) console.error('cause:', error.cause);
          } else {
            console.error(inspect(error, { depth: 4, colors: true }));
          }
          socket.emit('error', message);
        });
      });
    }

    // connect and disconnect events
    (async () => {
      const items = await getConnections()
      io.to('dispatcher').emit('dispatcher:connections', items);
    })();

    on('disconnect', async () => {
      const items = await getConnections();
      io.to('dispatcher').emit('dispatcher:connections', items);
    });

    // auth events
    on('passenger:auth:register', async (userData: PassengerRegister) => {
      const passenger = passengerStore.create(userData);
      socket.emit('auth:token', passenger.token);
    });

    on('driver:auth:register', async () => {
      throw Error('Самостоятельная регистрация не доступна для водителя');
    });

    on('passenger:auth:login', async () => {
      throw Error('Авторизация пока не доступна для пассажира');
    });

    on('driver:auth:login', async (credentials: DriverLogin) => {
      const driver = await driverStore.login(credentials);
      socket.emit('auth:token', driver.token);
    });

    on('passenger:auth:request', async () => {
      const passenger = socket.data.passenger;
      socket.emit('auth:profile', passenger);
    });

    on('driver:auth:request', async () => {
      const driver = socket.data.driver;
      socket.emit('auth:profile', driver);
    });

    on('passenger:profile:update', async (profile: Partial<Passenger>) => {
      const passenger = requirePassenger();
      const result = passengerStore.update(passenger.id, profile);
      io.to(`passenger:${passenger.id}`).emit('passenger:profile', result);
    });

    on('driver:profile:update', async (profile: Partial<Driver>) => {
      const driver = requireDriver();
      const result = driverStore.update(driver.id, profile);
      io.to(`driver:${driver.id}`).emit('driver:profile', result);
    });

    // orders events
    on('passenger:orders:create', async (input: Partial<PassengerOrder>) => {
      const passenger = requirePassenger();
      const result = orderStore.create({ ...input, passenger });

      io.to('driver').emit('driver:orders:created', result);
      io.to(`passenger:${passenger.id}`).emit(
        'passenger:orders',
        orderStore.listOfPassenger(passenger.id),
      );
    });

    on('passenger:orders:update', async (input: Partial<PassengerOrder>) => {
      const passenger = requirePassenger();
      if (!input.id) throw Error('Номер заказа должен быть указан');
      const result = orderStore.update(input.id, { ...input });

      io.to('driver').emit('driver:orders:updated', result);
      io.to(`passenger:${passenger.id}`).emit(
        'passenger:orders',
        orderStore.listOfPassenger(passenger.id),
      );
    });

    on('passenger:orders:delete', async (input: Partial<PassengerOrder>) => {
      const passenger = requirePassenger();
      if (!input.id) throw Error('Номер заказа должен быть указан');
      const result = orderStore.delete(input.id);

      io.to('driver').emit('driver:orders:deleted', result);
      io.to(`passenger:${passenger.id}`).emit(
        'passenger:orders',
        orderStore.listOfPassenger(passenger.id),
      );
    });

    on('passenger:orders:request', async () => {
      const passenger = requirePassenger();
      io.to(`passenger:${passenger.id}`).emit(
        'passenger:orders',
        orderStore.listOfPassenger(passenger.id),
      );
    });

    on('driver:orders:take', async (order: DriverOrder) => {
      const driver = requireDriver();
      if (!order.id) throw Error('Номер заказа должен быть указан');
      const result = orderStore.update(order.id, { driver, status: OrderStatus.DRIVER_ASSIGNED, assignedAt: new Date().toISOString() });

      io.to('driver').emit('driver:orders:taken', result);
      io.to(`passenger:${order.passenger.id}`).emit(
        'passenger:orders',
        orderStore.listOfPassenger(order.passenger.id),
      );
    });

    on('driver:orders:active:request', async () => {
      const driver = requireDriver();
      io.to(`driver:${driver.id}`).emit(
        'driver:orders:active',
        orderStore.listOfActive(),
      );
    });

    on('driver:orders:request', async () => {
      const driver = requireDriver();
      io.to(`driver:${driver.id}`).emit(
        'driver:orders',
        orderStore.listOfDriver(driver.id),
      );
    });

  });

  /** Тестовые водители для локальной разработки (логин = пароль). */
  await driverStore.bootstrap();

  return io;
}

