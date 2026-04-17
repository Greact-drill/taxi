import type { Server as HttpServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import { createSocketRuntime, joinRoleRooms } from './SocketRuntime.js';
import { registerPassengerEvents } from './events/registerPassengerEvents.js';
import { registerDriverEvents } from './events/registerDriverEvents.js';
import { registerDispatcherEvents } from './events/registerDispatcherEvents.js';
import type { Services } from '../services/index.js';

export async function createSocketServer(httpServer: HttpServer, services: Services): Promise<SocketIOServer> {
  const io = new SocketIOServer(httpServer, {
    path: '/ws',
    pingInterval: 25_000,  // сервер шлёт PING раз в 25 с
    pingTimeout: 20_000,   // ждёт PONG до 20 с
    // соединение упадёт лишь если клиент молчит 45 с суммарно

    connectionStateRecovery: {
      maxDisconnectionDuration: 3 * 60 * 1000, // хранить состояние 3 минуты
      skipMiddlewares: true,
    },

  });

  // install auth middleware
  io.use(async (socket, next) => {
    const role = socket.handshake.auth?.role;
    const token = socket.handshake.auth?.token;
    if (token) {
      if (role === 'passenger') {
        const passenger = await services.passengerService.findByToken(token);
        if (passenger) socket.data.passenger = passenger;
      } else if (role === 'driver') {
        const driver = await services.driverService.findByToken(token);
        if (driver) socket.data.driver = driver;
      }
    }
    next();
  });

  // register events
  io.on('connection', (socket) => {
    const role = socket.handshake.auth?.role;
    if (!['passenger', 'dispatcher', 'driver'].includes(role)) {
      socket.emit('error', `Role must be valid: ${role}`);
      return;
    }

    joinRoleRooms(socket, role);

    const ctx = createSocketRuntime(io, socket, services);
    registerPassengerEvents(ctx);
    registerDriverEvents(ctx);
    registerDispatcherEvents(ctx);
  });

  return io;
}
