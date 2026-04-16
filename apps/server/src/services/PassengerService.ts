import { randomUUID } from 'node:crypto';
import type { Passenger, PassengerRecord, PassengerRegister } from '@packages/shared';
import type { PassengerStoreRepository } from '../stores/contracts.js';

export class PassengerService {
  constructor(private readonly store: PassengerStoreRepository) { }

  async register(input: PassengerRegister): Promise<{ passenger: Passenger; token: string }> {
    const name = (input.name ?? '').trim();
    const phone = (input.phone ?? '').trim();
    const isPhoneValid = /^\+?\d+$/.test(phone);
    const canSubmit = name.length > 0 && phone.length > 0 && isPhoneValid;
    if (!canSubmit) {
      throw new Error(`Некорректные данные регистрации: ${name} ${phone}`);
    }
    const record = await this.store.create({ name, phone, token: randomUUID() });
    return {
      passenger: { id: record.id, name: record.name, phone: record.phone },
      token: record.token,
    };
  }

  async getById(id: number): Promise<Passenger | undefined> {
    const record = await this.store.getById(id);
    if (!record) return;
    return { id: record.id, name: record.name, phone: record.phone };
  }

  async findByToken(token: string): Promise<Passenger | undefined> {
    const record = await this.store.findByToken(token);
    if (!record) return;
    return { id: record.id, name: record.name, phone: record.phone };
  }

  async update(id: number, patch: Partial<Passenger>): Promise<Passenger> {
    const record = await this.store.update(id, { name: patch.name, phone: patch.phone });
    return { id: record.id, name: record.name, phone: record.phone };
  }
}
