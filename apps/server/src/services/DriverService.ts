import { randomUUID } from 'node:crypto';
import type { Driver, DriverLogin } from '@packages/shared';
import { makePasswordHash, verifyPassword } from '../password.js';
import { DriverStore } from '../stores/DriverStore.js';
import type { DriverRecord } from '../generated/prisma/client.js';

export type DriverCreateInput = {
  name: string;
  car: string;
  login: string;
  password: string;
};

function mapRecord(record: DriverRecord): Driver {
  return {
    id: record.id,
    name: record.name,
    car: record.car,
    login: record.deleted ? '—' : record.login,
  };
}

export class DriverService {
  constructor(private readonly store: DriverStore) { }

  async create(input: DriverCreateInput): Promise<Driver> {
    const name = input.name.trim();
    const car = input.car.trim();
    const login = input.login.trim();
    const password = input.password;
    const canSubmit = name.length > 0 && car.length > 0 && login.length > 0 && password.length > 0;
    if (!canSubmit) {
      throw new Error(`Некорректные данные водителя: ${name} ${car} ${login}`);
    }
    if (await this.findByLogin(login)) {
      throw new Error('Водитель с таким логином уже существует');
    }

    const record = await this.store.create({
      name,
      car,
      login,
      hash: await makePasswordHash(password),
      token: randomUUID(),
    });
    return mapRecord(record);
  }

  async getById(id: number): Promise<Driver | undefined> {
    const record = await this.store.getById(id);
    if (!record) return;
    return mapRecord(record);
  }

  async list(): Promise<Driver[]> {
    const records = await this.store.list();
    return records.map(mapRecord);
  }

  async login(data: DriverLogin): Promise<string> {
    const login = data.login.trim();
    const record = await this.store.findByLogin(login);
    if (!record || record.deleted || !(await verifyPassword(data.password, record.hash))) {
      throw new Error('Неверный логин или пароль');
    }
    return record.token;
  }

  async findByToken(token: string): Promise<Driver | undefined> {
    const record = await this.store.findByToken(token);
    if (!record || record.deleted) return;
    return mapRecord(record);
  }

  async findByLogin(login: string): Promise<Driver | undefined> {
    const record = await this.store.findByLogin(login);
    if (!record) return;
    return mapRecord(record);
  }

  async update(id: number, updates: Partial<Driver>): Promise<Driver> {
    const name = updates.name !== undefined ? updates.name.trim() : undefined;
    const car = updates.car !== undefined ? updates.car.trim() : undefined;
    const newLogin = updates.login !== undefined ? updates.login.trim() : undefined;

    if (newLogin !== undefined && newLogin.length === 0) {
      throw new Error('Логин не может быть пустым');
    }

    const before = await this.store.getById(id);
    if (!before || before.deleted) throw new Error('Водитель не найден');

    const record = await this.store.update(id, {
      name,
      car,
      login: newLogin,
    });
    return mapRecord(record);
  }

  async setPassword(id: number, newPassword: string): Promise<Driver> {
    const existing = await this.store.getById(id);
    if (!existing || existing.deleted) throw new Error('Водитель не найден');
    const trimmed = newPassword.trim();
    if (trimmed.length === 0) {
      throw new Error('Пароль не может быть пустым');
    }
    const record = await this.store.update(id, {
      hash: await makePasswordHash(trimmed),
      token: randomUUID(),
    });
    return mapRecord(record);
  }

  async remove(id: number): Promise<void> {
    await this.store.delete(id);
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
