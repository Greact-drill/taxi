import { randomUUID } from 'node:crypto';
import type { Passenger, PassengerRegister } from '@packages/shared';
import { PassengerStore } from '../stores/PassengerStore.js';

export class PassengerService {
  constructor(private readonly store: PassengerStore) {}

  async register(input: PassengerRegister): Promise<Passenger> {
    const name = (input.name ?? '').trim();
    const phone = (input.phone ?? '').trim();
    const isPhoneValid = /^\+?\d+$/.test(phone);
    const canSubmit = name.length > 0 && phone.length > 0 && isPhoneValid;
    if (!canSubmit) {
      throw new Error(`Некорректные данные регистрации: ${name} ${phone}`);
    }
    return await this.store.create({ name, phone, token: randomUUID() });
  }

  async findByToken(token: string): Promise<Passenger | undefined> {
    return await this.store.findWhere((passenger) => passenger.token === token);
  }

  async update(id: number, patch: Partial<Passenger>): Promise<Passenger | undefined> {
    return await this.store.update(id, patch);
  }
}
