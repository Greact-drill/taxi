import type { Server as HttpServer } from 'node:http';
import { inspect } from 'node:util';
import { Server } from 'socket.io';
import { PassengerStore } from '../stores/PassengerStore.js';
import { DriverStore } from '../stores/DriverStore.js';
import { OrderStore } from '../stores/OrderStore.js';
import { PassengerService } from '../services/PassengerService.js';
import { DriverService } from '../services/DriverService.js';
import { OrderService } from '../services/OrderService.js';
import {
  DELETABLE_ORDER_STATUSES,
  OrderStatus,
  type DispatcherConnectionsItem,
  type Driver,
  type DriverLogin,
  type DriverOrder,
  type Order,
  type Passenger,
  type PassengerOrder,
  type PassengerRegister,
} from '@packages/shared';

const CLEAN_TIMEOUT = 30_000;

export async function createSocketServer(httpServer: HttpServer): Promise<Server> {
  const io = new Server(httpServer, {
    path: '/ws',
    pingInterval: 1000,
    pingTimeout: 1000,
  });

  const passengerStore = new PassengerStore();
  const driverStore = new DriverStore();
  const orderStore = new OrderStore();
  const passengerService = new PassengerService(passengerStore);
  const driverService = new DriverService(driverStore);
  const orderService = new OrderService(orderStore, passengerService, driverService);

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

  io.use(async (socket, next) => {
    try {
      const role = socket.handshake.auth?.role;
      const token = socket.handshake.auth?.token;
      if (token) {
        if (role === 'passenger') {
          const passenger = await passengerService.findByToken(token);
          if (passenger) socket.data.passenger = passenger;
        } else if (role === 'driver') {
          const driver = await driverService.findByToken(token);
          if (driver) socket.data.driver = driver;
        }
      }
      next();
    } catch (err) {
      next(err as Error);
    }
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

    function handleAsyncError(error: unknown): void {
      const message = error instanceof Error ? error.message : 'Unknown server error';
      if (error instanceof Error) {
        console.error(error.stack ?? `${error.name}: ${error.message}`);
        if (error.cause) console.error('cause:', error.cause);
      } else {
        console.error(inspect(error, { depth: 4, colors: true }));
      }
      socket.emit('error', message);
    }

    function on<P extends unknown[]>(
      event: string,
      handler: (...args: P) => Promise<void>,
    ): void {
      socket.on(event, (...args: P) => {
        void handler(...args).catch(handleAsyncError);
      });
    }

    function timeout(delayMs: number, handler: () => Promise<void>): ReturnType<typeof setTimeout> {
      return setTimeout(() => {
        void handler().catch(handleAsyncError);
      }, delayMs);
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
      const { token } = await passengerService.register(userData);
      socket.emit('auth:token', token);
    });

    on('driver:auth:register', async () => {
      throw Error('Самостоятельная регистрация не доступна для водителя');
    });

    on('passenger:auth:login', async () => {
      throw Error('Авторизация пока не доступна для пассажира');
    });

    on('driver:auth:login', async (credentials: DriverLogin) => {
      const token = await driverService.login(credentials);
      socket.emit('auth:token', token);
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
      const result = await passengerService.update(passenger.id, profile);
      io.to(`passenger:${passenger.id}`).emit('passenger:profile', result);
    });

    on('driver:profile:update', async (profile: Partial<Driver>) => {
      const driver = requireDriver();
      const result = await driverService.update(driver.id, profile);
      io.to(`driver:${driver.id}`).emit('driver:profile', result);
    });

    // passenger orders events
    on('passenger:orders:request', async () => {
      const passenger = requirePassenger();
      io.to(`passenger:${passenger.id}`).emit(
        'passenger:orders',
        await orderService.listOfPassenger(passenger.id),
      );
    });

    on('passenger:orders:create', async (input: Partial<PassengerOrder>) => {
      const passenger = requirePassenger();
      await orderService.create(input, passenger);

      io.to(`passenger:${passenger.id}`).emit(
        'passenger:orders',
        await orderService.listOfPassenger(passenger.id),
      );
      io.to('driver').emit(
        'driver:orders:active',
        await orderService.listOfActive(),
      );
    });

    on('passenger:orders:update', async (input: Partial<PassengerOrder>) => {
      const passenger = requirePassenger();
      if (!input.id) throw Error('Номер заказа должен быть указан');
      const result = await orderService.update(input.id, { ...input });

      io.to(`passenger:${passenger.id}`).emit(
        'passenger:orders',
        await orderService.listOfPassenger(passenger.id),
      );
      if (result.driver) {
        const driver = result.driver!
        io.to(`driver:${driver.id}`).emit(
          'driver:orders',
          await orderService.listOfDriver(driver.id),
        );
      } else {
        io.to('driver').emit(
          'driver:orders:active',
          await orderService.listOfActive(),
        );
      }
    });

    on('passenger:orders:delete', async (input: Partial<PassengerOrder>) => {
      const passenger = requirePassenger();
      if (!input.id) throw Error('Номер заказа должен быть указан');
      const deletable = [OrderStatus.AWAITING_DRIVER, ...DELETABLE_ORDER_STATUSES]
      if (input.status && !deletable.includes(input.status)) {
        throw Error(`Заказ можно удалить только в статусах ${DELETABLE_ORDER_STATUSES}`);
      }
      await orderService.delete(input.id);

      io.to(`passenger:${passenger.id}`).emit(
        'passenger:orders',
        await orderService.listOfPassenger(passenger.id),
      );
      if (input.driver) {
        io.to(`driver:${input.driver.id}`).emit(
          'driver:orders',
          await orderService.listOfDriver(input.driver.id),
        );
      }
      io.to('driver').emit(
        'driver:orders:active',
        await orderService.listOfActive(),
      );
    });

    // driver orders events
    on('driver:orders:active:request', async () => {
      const driver = requireDriver();
      io.to(`driver:${driver.id}`).emit(
        'driver:orders:active',
        await orderService.listOfActive(),
      );
    });

    on('driver:orders:request', async () => {
      const driver = requireDriver();
      io.to(`driver:${driver.id}`).emit(
        'driver:orders',
        await orderService.listOfDriver(driver.id),
      );
    });

    on('driver:orders:take', async (order: DriverOrder) => {
      const driver = requireDriver();
      await orderService.update(order.id, { driver, status: OrderStatus.DRIVER_ASSIGNED });

      io.to(`passenger:${order.passenger.id}`).emit(
        'passenger:orders',
        await orderService.listOfPassenger(order.passenger.id),
      );
      io.to(`driver:${driver.id}`).emit(
        'driver:orders',
        await orderService.listOfDriver(driver.id),
      );
      io.to('driver').emit(
        'driver:orders:active',
        await orderService.listOfActive(),
      );

    });

    function deleteAfterTimeout(order: DriverOrder): void {
      timeout(CLEAN_TIMEOUT, async () => {
        if (await orderService.findById(order.id)) {
          await orderService.delete(order.id);
          io.to(`passenger:${order.passenger.id}`).emit(
            'passenger:orders',
            await orderService.listOfPassenger(order.passenger.id),
          );
          io.to(`driver:${driver.id}`).emit(
            'driver:orders',
            await orderService.listOfDriver(driver.id),
          );
        }
      });
    }

    on('driver:orders:next', async (order: DriverOrder, status: OrderStatus) => {
      const driver = requireDriver();
      await orderService.update(order.id, { status });

      io.to(`passenger:${order.passenger.id}`).emit(
        'passenger:orders',
        await orderService.listOfPassenger(order.passenger.id),
      );
      io.to(`driver:${driver.id}`).emit(
        'driver:orders',
        await orderService.listOfDriver(driver.id),
      );
      if (status === OrderStatus.COMPLETED) {
        deleteAfterTimeout(order);
      }
    });

    on('driver:orders:cancel', async (order: DriverOrder, reason: string) => {
      const driver = requireDriver();
      await orderService.update(order.id, {
        status: OrderStatus.CANCELLED,
        cancelReason: reason,
      });

      io.to(`passenger:${order.passenger.id}`).emit(
        'passenger:orders',
        await orderService.listOfPassenger(order.passenger.id),
      );
      io.to(`driver:${driver.id}`).emit(
        'driver:orders',
        await orderService.listOfDriver(driver.id),
      );
      deleteAfterTimeout(order);
    });

    on('driver:orders:delete', async (order: DriverOrder) => {
      const driver = requireDriver();
      if (order.status && !DELETABLE_ORDER_STATUSES.includes(order.status)) {
        throw Error(`Заказ можно удалить только в статусах ${DELETABLE_ORDER_STATUSES}`);
      }
      await orderService.delete(order.id);

      io.to(`passenger:${order.passenger.id}`).emit(
        'passenger:orders',
        await orderService.listOfPassenger(order.passenger.id),
      );
      io.to(`driver:${driver.id}`).emit(
        'driver:orders',
        await orderService.listOfDriver(driver.id),
      );
    });

  });

  /** Тестовые водители для локальной разработки (логин = пароль). */
  await driverService.bootstrap();

  return io;
}
