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
      { name: 'Иван Петров', car: 'Kia Rio · а111аа77', login: 'driver1', password: '1' },
      { name: 'Сергей Козлов', car: 'VW Polo · в222вв77', login: 'driver2', password: '2' },
      { name: 'Алексей Смирнов', car: 'Skoda Rapid · с333сс77', login: 'driver3', password: '3' },
      { name: 'Дмитрий Волков', car: 'Renault Logan · е444ее77', login: 'driver4', password: '4' },
      { name: 'Андрей Новиков', car: 'Lada Vesta · к555кк77', login: 'driver5', password: '5' },
      { name: 'Михаил Орлов', car: 'Hyundai Solaris · м666мм77', login: 'driver6', password: '6' },
      { name: 'Николай Соколов', car: 'Toyota Camry · о777оо77', login: 'driver7', password: '7' },
      { name: 'Павел Лебедев', car: 'Kia Optima · р888рр77', login: 'driver8', password: '8' },
      { name: 'Егор Морозов', car: 'Mazda 6 · т999тт77', login: 'driver9', password: '9' },
      { name: 'Константин Егоров', car: 'Haval Jolion · х000хх77', login: 'driver10', password: '10' },
      { name: 'Альберт Шайхутдинов', car: 'Haval M6 · о031оа04', login: 'driver11', password: '11' },
    ];
    for (const input of seeds) {
      if (!(await this.findByLogin(input.login))) {
        await this.create(input);
      }
    }
  }
}
