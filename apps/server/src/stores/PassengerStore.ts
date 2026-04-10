import { randomUUID } from 'node:crypto';
import type { Passenger } from '@packages/shared';

export class PassengerStore {
  private passengerStore = new Map<number, Passenger>();
  private nextId = 1;

  create(input: Partial<Passenger>): Passenger {
    const name = (input.name ?? '').trim();
    const phone = (input.phone ?? '').trim();
    const isPhoneValid = /^\+?\d+$/.test(phone);
    const canSubmit = name.length > 0 && phone.length > 0 && isPhoneValid;
    // TODO validation messages
    if (!canSubmit) {
      throw Error(`Некорректные данные регистрации: ${name} ${phone}`);
    }

    const passenger: Passenger = { id: this.nextId++, name, phone, token: randomUUID() };
    this.passengerStore.set(passenger.id, passenger);
    return passenger;
  }

  findByToken(token: string): Passenger | undefined {
    for (const passenger of this.passengerStore.values()) {
      if (passenger.token === token) return passenger;
    }
  }

  getById(id: number): Passenger | undefined {
    return this.passengerStore.get(id);
  }

  update(id: number, patch: Partial<Passenger>): Passenger | undefined {
    const record = this.passengerStore.get(id);
    if (!record) return undefined;
    Object.assign(record, patch, { id });
    return record;
  }
}

