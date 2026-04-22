import { randomUUID } from 'node:crypto';
import type { Passenger, PassengerRegisterInput } from '@packages/shared';
import type { PassengerRecord, Prisma } from '../generated/prisma/client.js';

function mapRecord(record: PassengerRecord): Passenger {
  const { id, name, phone } = record;
  return { id, name, phone };
}

export class PassengerService {
  constructor(private readonly orm: Prisma.PassengerRecordDelegate) { }

  async register(input: PassengerRegisterInput): Promise<string> {
    const { name, phone } = input;
    const record = await this.orm.create({
      data: { name, phone, token: randomUUID() },
    });
    return record.token!;
  }

  async getById(id: number): Promise<Passenger | undefined> {
    const record = await this.orm.findUnique({ where: { id } });
    if (!record) return;
    return mapRecord(record);
  }

  async list(): Promise<Passenger[]> {
    const records = await this.orm.findMany({
      where: { deleted: false },
      orderBy: { id: 'asc' },
    });
    return records.map(mapRecord);
  }

  async findByToken(token: string): Promise<Passenger | undefined> {
    const record = await this.orm.findUnique({ where: { token } });
    if (!record) return;
    return mapRecord(record);
  }

  async update(id: number, patch: Partial<Passenger>): Promise<Passenger> {
    const { name, phone } = patch;
    const record = await this.orm.update({
      where: { id },
      data: { name, phone },
    });
    return mapRecord(record);
  }
}
