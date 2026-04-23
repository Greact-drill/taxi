import type { Server as SocketIOServer, Socket as SocketIOClient } from 'socket.io';
import type { Driver, StatusMap, Order, Passenger } from '@packages/shared';
import type { PassengerService } from '../services/PassengerService.js';
import type { DriverService } from '../services/DriverService.js';
import type { OrderService } from '../services/OrderService.js';
import type { OrderChatService } from '../services/OrderChatService.js';

const COMPLETED_CLEAN_TIMEOUT = 30_000; // 30 секунд после завершения заказа
const CANCELLED_CLEAN_TIMEOUT = 60_000; // 60 секунд после отмены заказа

export const CLEAN_TIMEOUTS = {
  COMPLETED_CLEAN_TIMEOUT,
  CANCELLED_CLEAN_TIMEOUT,
};

export type SocketRuntimeServices = {
  passengerService: PassengerService;
  driverService: DriverService;
  orderService: OrderService;
  orderChatService: OrderChatService;
};

export type SocketRuntimeContext = {
  io: SocketIOServer;
  socket: SocketIOClient;
  passengerService: PassengerService;
  driverService: DriverService;
  orderService: OrderService;
  orderChatService: OrderChatService;
  statusMap: StatusMap;

  requirePassenger: () => Passenger;
  requireDriver: () => Driver;
  on: <P extends unknown[]>(event: string, handler: (...args: P) => Promise<void>) => void;
  timeout: (delayMs: number, handler: () => Promise<void>) => ReturnType<typeof setTimeout>;
  deleteAfterTimeout: (order: Order, timeoutMs: number) => void;
  send: <T extends unknown[]>(room: string, event: string, ...payloadArgs: T) => void;
};

export function joinRoleRooms(socket: SocketIOClient, role: string): void {
  socket.join(role);

  const passenger = socket.data.passenger as Passenger | undefined;
  if (passenger) {
    socket.join(`passenger:${passenger.id}`);
  }

  const driver = socket.data.driver as Driver | undefined;
  if (driver) {
    socket.join(`driver:${driver.id}`);
  }
}

export function createSocketRuntime(io: SocketIOServer, socket: SocketIOClient, services: SocketRuntimeServices, statusMap: StatusMap): SocketRuntimeContext {
  const { passengerService, driverService, orderService, orderChatService } = services;

  function requirePassenger(): Passenger {
    const passenger = socket.data.passenger as Passenger | undefined;
    if (passenger) return passenger;
    throw Error('Пассажир должен быть авторизован');
  }

  function requireDriver(): Driver {
    const driver = socket.data.driver as Driver | undefined;
    if (driver) return driver;
    throw Error('Водитель должен быть авторизован');
  }

  function handleAsyncError(error: unknown): void {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    if (error instanceof Error) {
      console.error(error.stack ?? `${error.name}: ${error.message}`);
    };
    socket.emit('error', message);
  }

  function on<P extends unknown[]>(
    event: string,
    handler: (...args: P) => Promise<void>,
  ): void {
    socket.on(event, (...args: P) => {
      handler(...args).catch(handleAsyncError);
    });
  }

  function timeout(delayMs: number, handler: () => Promise<void>): ReturnType<typeof setTimeout> {
    return setTimeout(() => {
      handler().catch(handleAsyncError);
    }, delayMs);
  }

  function deleteAfterTimeout(order: Order, timeoutMs: number): void {
    timeout(timeoutMs, async () => {
      if (await orderService.findById(order.id)) {
        await orderService.delete(order.id);
        send(`passenger:${order.passenger.id}`, 'passenger:orders', await orderService.listOfPassenger(order.passenger.id));
        if (order.driver) {
          send(`driver:${order.driver.id}`, 'driver:orders', await orderService.listOfDriver(order.driver.id));
        }
        send('dispatcher', 'dispatcher:orders', await orderService.list());
      }
    });
  }

  function send<T extends unknown[]>(
    room: string,
    event: string,
    ...payloadArgs: T
  ): void {
    // Важно: send предназначен ТОЛЬКО для рассылок через io.to(...).emit(...)
    io.to(room).emit(event, ...payloadArgs);
  }

  return {
    io,
    socket,
    passengerService,
    driverService,
    orderService,
    orderChatService,
    statusMap,

    requirePassenger,
    requireDriver,
    on,
    timeout,
    deleteAfterTimeout,
    send,
  };
}

export { COMPLETED_CLEAN_TIMEOUT, CANCELLED_CLEAN_TIMEOUT };

