import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import type {
  AuthCheckPayload,
  AuthCheckResponse,
  AuthRegisterPayload,
  AuthRegisterResponse,
  DispatcherConnectionsPayload,
  ErrorCode,
  DriverOrderCreatedPayload,
  DriverOrderUpdatedPayload,
  MeGetPayload,
  MeGetResponse,
  OrdersCreatePayload,
  OrdersCreateResponse,
  OrdersDeletePayload,
  OrdersDeleteResponse,
  OrdersGetPayload,
  OrdersGetResponse,
  OrdersListPayload,
  OrdersListResponse,
  OrdersUpdatePayload,
  OrdersUpdateResponse,
  PassengerOrdersPayload,
  Passenger,
  Result,
} from '@packages/shared';
import { PassengerStore } from '../stores/PassengerStore.js';
import { OrderStore } from '../stores/OrderStore.js';
import { AuthService } from '../services/AuthService.js';
import { OrderService } from '../services/OrderService.js';
import './socket-data.js';

type Ack<T> = (res: T) => void;

function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}

function fail(code: ErrorCode, message: string): Result<never> {
  return { ok: false, error: { code, message } };
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isInteger(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v);
}

function isRole(v: unknown): v is 'passenger' | 'dispatcher' | 'driver' {
  return v === 'passenger' || v === 'dispatcher' || v === 'driver';
}

function requirePassengerOrAck<T>(
  socket: { data: { passenger?: Passenger } },
  ack: Ack<T> | undefined,
): Passenger | null {
  const passenger = socket.data.passenger;
  if (passenger) return passenger;
  (ack as Ack<Result<never>> | undefined)?.(fail('UNAUTHORIZED', 'No token or invalid token'));
  return null;
}

export function createSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    path: '/ws',
    pingInterval: 1000,
    pingTimeout: 1000,
  });

  const passengerStore = new PassengerStore();
  const orderStore = new OrderStore();
  const authService = new AuthService(passengerStore);
  const orderService = new OrderService(orderStore);

  async function emitConnections(): Promise<void> {
    const sockets = await io.fetchSockets();
    const items: DispatcherConnectionsPayload['items'] = sockets.map((s) => {
      const role = s.handshake.auth?.role;
      const token = s.handshake.auth?.token;
      return {
        role: typeof role === 'string' ? role : 'unknown',
        token: typeof token === 'string' ? token : undefined,
      };
    });

    io.to('dispatcher').emit('dispatcher:connections', { items } satisfies DispatcherConnectionsPayload);
  }

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (isNonEmptyString(token)) {
      const passenger = authService.findPassengerByToken(token);
      if (passenger) socket.data.passenger = passenger;
    }
    next();
  });

  io.on('connection', (socket) => {
    const role = isRole(socket.handshake.auth?.role) ? socket.handshake.auth.role : 'passenger';
    socket.join(role);
    void emitConnections();

    socket.on('disconnect', () => {
      void emitConnections();
    });

    if (socket.data.passenger) {
      socket.join(`passenger:${socket.data.passenger.id}`);
    }

    socket.on('auth:check', (payload: AuthCheckPayload, ack?: Ack<AuthCheckResponse>) => {
      const token = payload?.token ?? socket.handshake.auth?.token;
      if (!isNonEmptyString(token)) {
        ack?.(ok({}));
        return;
      }

      const passenger = authService.findPassengerByToken(token);
      if (!passenger) {
        ack?.(ok({}));
        return;
      }

      ack?.(ok({ passenger }));
    });

    socket.on('auth:register', (payload: AuthRegisterPayload, ack?: Ack<AuthRegisterResponse>) => {
      if (!isNonEmptyString(payload?.name) || !isNonEmptyString(payload?.phone)) {
        ack?.(fail('BAD_REQUEST', 'name and phone are required'));
        return;
      }

      const passenger = authService.register(payload.name.trim(), payload.phone.trim());
      ack?.(ok({ token: passenger.token, passenger }));
    });

    socket.on('me:get', (_: MeGetPayload, ack?: Ack<MeGetResponse>) => {
      const passenger = requirePassengerOrAck(socket, ack);
      if (!passenger) return;
      ack?.(ok({ passenger }));
    });

    socket.on('orders:list', (_: OrdersListPayload, ack?: Ack<OrdersListResponse>) => {
      const passenger = requirePassengerOrAck(socket, ack);
      if (!passenger) return;

      const items = orderService.listOrders(passenger.id);
      ack?.(ok({ items }));
    });

    socket.on('orders:get', (payload: OrdersGetPayload, ack?: Ack<OrdersGetResponse>) => {
      const passenger = requirePassengerOrAck(socket, ack);
      if (!passenger) return;
      if (!isInteger(payload?.id)) {
        ack?.(fail('BAD_REQUEST', 'id is required'));
        return;
      }

      const item = orderService.getOrder(passenger.id, payload.id);
      if (!item) {
        ack?.(fail('NOT_FOUND', 'order not found'));
        return;
      }
      ack?.(ok({ item }));
    });

    socket.on('orders:create', (payload: OrdersCreatePayload, ack?: Ack<OrdersCreateResponse>) => {
      const passenger = requirePassengerOrAck(socket, ack);
      if (!passenger) return;
      if (!isNonEmptyString(payload?.from) || !isNonEmptyString(payload?.to)) {
        ack?.(fail('BAD_REQUEST', 'from and to are required'));
        return;
      }

      const item = orderService.createOrder(passenger.id, payload.from.trim(), payload.to.trim());
      io.to('driver').emit('driver:orderCreated', { item } satisfies DriverOrderCreatedPayload);
      io
        .to(`passenger:${passenger.id}`)
        .emit('passenger:orders', { items: orderService.listOrders(passenger.id) } satisfies PassengerOrdersPayload);
      ack?.(ok({ item }));
    });

    socket.on('orders:update', (payload: OrdersUpdatePayload, ack?: Ack<OrdersUpdateResponse>) => {
      const passenger = requirePassengerOrAck(socket, ack);
      if (!passenger) return;
      if (!isInteger(payload?.id) || !isNonEmptyString(payload?.from) || !isNonEmptyString(payload?.to)) {
        ack?.(fail('BAD_REQUEST', 'id, from and to are required'));
        return;
      }

      const item = orderService.updateOrder(passenger.id, payload.id, {
        from: payload.from.trim(),
        to: payload.to.trim(),
      });

      if (!item) {
        ack?.(fail('NOT_FOUND', 'order not found'));
        return;
      }

      io.to('driver').emit('driver:orderUpdated', { item } satisfies DriverOrderUpdatedPayload);
      io
        .to(`passenger:${passenger.id}`)
        .emit('passenger:orders', { items: orderService.listOrders(passenger.id) } satisfies PassengerOrdersPayload);
      ack?.(ok({ item }));
    });

    socket.on('orders:delete', (payload: OrdersDeletePayload, ack?: Ack<OrdersDeleteResponse>) => {
      const passenger = requirePassengerOrAck(socket, ack);
      if (!passenger) return;
      if (!isInteger(payload?.id)) {
        ack?.(fail('BAD_REQUEST', 'id is required'));
        return;
      }

      const deleted = orderService.deleteOrder(passenger.id, payload.id);
      if (!deleted) {
        ack?.(fail('NOT_FOUND', 'order not found'));
        return;
      }

      io
        .to(`passenger:${passenger.id}`)
        .emit('passenger:orders', { items: orderService.listOrders(passenger.id) } satisfies PassengerOrdersPayload);
      ack?.(ok({}));
    });
  });

  return io;
}

