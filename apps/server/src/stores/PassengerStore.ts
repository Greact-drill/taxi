import type { PassengerRecord } from '@packages/shared';

export class PassengerStore {
  private passengerStore = new Map<number, PassengerRecord>();
  private nextId = 1;

  async create(data: Omit<PassengerRecord, 'id'>): Promise<PassengerRecord> {
    const passenger: PassengerRecord = { ...data, id: this.nextId++ };
    this.passengerStore.set(passenger.id, passenger);
    return passenger;
  }

  async findWhere(match: (passenger: PassengerRecord) => boolean): Promise<PassengerRecord | undefined> {
    for (const passenger of this.passengerStore.values()) {
      if (match(passenger)) return passenger;
    }
  }

  async getById(id: number): Promise<PassengerRecord | undefined> {
    return this.passengerStore.get(id);
  }

  async update(id: number, patch: Partial<PassengerRecord>): Promise<PassengerRecord> {
    const record = this.passengerStore.get(id);
    if (!record) throw Error(`PassengerStore: Record not found ${id}`);
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined) continue;
      (record as Record<string, unknown>)[key] = value;
    }
    record.id = id;
    return record;
  }
}
