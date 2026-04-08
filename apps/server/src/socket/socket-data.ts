import type { Passenger } from '@packages/shared';
import 'socket.io';

declare module 'socket.io' {
  interface SocketData {
    passenger?: Passenger;
  }
}

