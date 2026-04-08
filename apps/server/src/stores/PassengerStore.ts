import type { Passenger } from '@packages/shared';

export class PassengerStore {
  private passengerStore = new Map<number, Passenger>();
  private passengerByToken = new Map<string, Passenger>();
  private nextId = 1;

  create(input: Omit<Passenger, 'id'>): Passenger {
    const passenger: Passenger = { ...input, id: this.nextId++ };
    this.passengerStore.set(passenger.id, passenger);
    this.passengerByToken.set(passenger.token, passenger);
    return passenger;
  }

  findByToken(token: string): Passenger | null {
    return this.passengerByToken.get(token) ?? null;
  }
}

