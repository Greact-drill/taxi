import type { Passenger } from '@packages/shared';

export class PassengerStore {
  private passengerStore = new Map<number, Passenger>();
  private nextId = 1;

  async create(data: Omit<Passenger, 'id'>): Promise<Passenger> {
    const passenger: Passenger = { ...data, id: this.nextId++ };
    this.passengerStore.set(passenger.id, passenger);
    return passenger;
  }

  async findWhere(match: (passenger: Passenger) => boolean): Promise<Passenger | undefined> {
    for (const passenger of this.passengerStore.values()) {
      if (match(passenger)) return passenger;
    }
  }

  async getById(id: number): Promise<Passenger | undefined> {
    return this.passengerStore.get(id);
  }

  async update(id: number, patch: Partial<Passenger>): Promise<Passenger> {
    const record = this.passengerStore.get(id);
    if (!record) throw Error(`PassengerStore: Record not found ${id}`);
    Object.assign(record, patch, { id });
    return record;
  }
}
