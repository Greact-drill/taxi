import { randomUUID } from 'node:crypto';
import type { Passenger } from '@packages/shared';
import { PassengerStore } from '../stores/PassengerStore.js';

export class AuthService {
  constructor(private passengers: PassengerStore) {}

  register(name: string, phone: string): Passenger {
    return this.passengers.create({
      name,
      phone,
      token: randomUUID(),
    });
  }

  findPassengerByToken(token: string): Passenger | null {
    return this.passengers.findByToken(token);
  }
}

