import type { Server as HttpServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import { PassengerStore } from '../stores/PassengerStore.js';
import { OrderStore } from '../stores/OrderStore.js';
import type { DispatcherConnectionsItem, Passenger, PassengerOrder } from '@packages/shared';

export function createSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    path: '/ws',
    pingInterval: 1000,
    pingTimeout: 1000,
  });

  const passengerStore = new PassengerStore();
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
    const token = socket.handshake.auth?.token;
    if (token) {
      const passenger = passengerStore.findByToken(token);
      if (passenger) socket.data.passenger = passenger;
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
      socket.join(`driver:${passenger.id}`);
    }

    function requirePassenger(): Passenger {
      const passenger = socket.data.passenger;
      if (passenger) return passenger;
      else throw Error('Passenger must be authorized') 
    }
    
    function on<P extends unknown[]>(
      event: string,
      handler: (...args: P) => Promise<void>,
    ): void {
      socket.on(event, (...args: P) => {
        void handler(...args).catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : 'Unknown server error';
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
    on('auth:register', async (userData: Partial<Passenger>) => {
      const passenger = passengerStore.create(userData);
      socket.emit('auth:token', passenger.token);
    });

    on('auth:request', async () => {
      const passenger = socket.data.passenger;
      socket.emit('auth:profile', passenger);
    });

    on('profile:update', async (profile: Partial<Passenger>) => {
      const passenger = requirePassenger();

      const result = passengerStore.update(passenger.id, profile);
      io.to(`passenger:${passenger.id}`).emit('passenger:profile', result);
    });

    // orders events
    on('orders:create', async (input: Partial<PassengerOrder>) => {
      const passenger = requirePassenger();
      const result = orderStore.create({ ...input, passenger });

      io.to('driver').emit('driver:orderCreated', result);
      io.to(`passenger:${passenger.id}`).emit(
          'passenger:orders',
          orderStore.listOfPassenger(passenger.id),
        );
    });

    on('orders:update', async (input: Partial<PassengerOrder>) => {
      const passenger = requirePassenger();
      if (!input.id) throw Error('Order ID is required');
      const result = orderStore.update(input.id, { ...input });

      io.to('driver').emit('driver:orderUpdated', result);
      io.to(`passenger:${passenger.id}`).emit(
          'passenger:orders',
          orderStore.listOfPassenger(passenger.id),
        );
    });

    on('orders:delete', async (input: Partial<PassengerOrder>) => {
      const passenger = requirePassenger();
      if (!input.id) throw Error('Order ID is required');
      const result = orderStore.delete(input.id);

      io.to('driver').emit('driver:orderDeleted', result);
      io.to(`passenger:${passenger.id}`).emit(
          'passenger:orders',
          orderStore.listOfPassenger(passenger.id),
        );
    });

    on('orders:request', async () => {
      const passenger = requirePassenger();
      io.to(`passenger:${passenger.id}`).emit(
        'passenger:orders',
        orderStore.listOfPassenger(passenger.id),
      );
    });

  });

  return io;
}

