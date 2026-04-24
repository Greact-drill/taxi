import { randomUUID } from 'node:crypto';
import type { Driver, DriverCreateInput, DriverLoginInput } from '@packages/shared';
import { makePasswordHash, verifyPassword } from '../password.js';
import type { DriverRecord, Prisma } from '../generated/prisma/client.js';

function mapRecord(record: DriverRecord): Driver {
  const { id, name, car, login } = record;
  return { id, name, car, login };
}

export class DriverService {
  constructor(private readonly orm: Prisma.DriverRecordDelegate) { }

  async create(input: DriverCreateInput): Promise<Driver> {
    const { name, car, login, password } = input;
    const record = await this.orm.create({
      data: {
        name,
        car,
        login,
        hash: await makePasswordHash(password),
        token: randomUUID(),
      },
    });
    return mapRecord(record);
  }

  async getById(id: number): Promise<Driver | undefined> {
    const record = await this.orm.findUnique({ where: { id } });
    if (!record) return;
    return mapRecord(record);
  }

  async list(): Promise<Driver[]> {
    const records = await this.orm.findMany({
      where: { deleted: false },
      orderBy: { id: 'asc' },
    });
    return records.map(mapRecord);
  }

  async login(input: DriverLoginInput): Promise<string> {
    const { login, password } = input;
    const record = await this.orm.findUnique({ where: { login } });
    const valid = record && !record.deleted && await verifyPassword(password, record.hash);
    if (!valid) throw new Error('Неверный логин или пароль');
    return record.token!;
  }

  async findByToken(token: string): Promise<Driver | undefined> {
    const record = await this.orm.findUnique({ where: { token } });
    if (!record || record.deleted) return;
    return mapRecord(record);
  }

  async findByLogin(login: string): Promise<Driver | undefined> {
    const record = await this.orm.findUnique({ where: { login } });
    if (!record) return;
    return mapRecord(record);
  }

  async update(id: number, input: Partial<Driver>): Promise<Driver> {
    const { name, car, login } = input;
    const record = await this.orm.update({
      where: { id },
      data: {
        name,
        car,
        login,
      }
    });
    return mapRecord(record);
  }

  async setPassword(id: number, password: string): Promise<Driver> {
    const record = await this.orm.update({
      where: { id },
      data: {
        hash: await makePasswordHash(password),
        token: randomUUID(),
      }
    });
    return mapRecord(record);
  }

  async remove(id: number): Promise<void> {
    await this.orm.update({
      where: { id },
      data: {
        deleted: true,
        deletedAt: new Date().toISOString(),
        token: null,
        hash: '',
      },
    });
  }

  async bootstrap(): Promise<void> {
    const seeds: DriverCreateInput[] = [
      { name: 'Альберт Шайхутдинов', car: 'Белый Haval 031', login: 'driver11', password: '11' },
    ];
    for (const input of seeds) {
      if (!(await this.findByLogin(input.login))) {
        await this.create(input);
      }
    }
  }
}
