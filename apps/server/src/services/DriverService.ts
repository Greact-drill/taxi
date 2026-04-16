import { randomUUID } from 'node:crypto';
import type { Driver, DriverLogin, DriverRecord } from '@packages/shared';
import { makePasswordHash, verifyPassword } from '../password.js';
import type { DriverStoreRepository } from '../stores/contracts.js';

export type DriverCreateInput = {
  name: string;
  car: string;
  login: string;
  password: string;
};

export class DriverService {
  constructor(private readonly store: DriverStoreRepository) { }

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
    return { id: record.id, name: record.name, car: record.car };
  }

  async getById(id: number): Promise<Driver | undefined> {
    const record = await this.store.getById(id);
    if (!record) return;
    return { id: record.id, name: record.name, car: record.car };
  }

  async login(data: DriverLogin): Promise<string> {
    const login = data.login.trim();
    const record = await this.store.findByLogin(login);
    if (!record || !(await verifyPassword(data.password, record.hash))) {
      throw new Error('Неверный логин или пароль');
    }
    return record.token;
  }

  async findByToken(token: string): Promise<Driver | undefined> {
    const record = await this.store.findByToken(token);
    if (!record) return;
    return { id: record.id, name: record.name, car: record.car };
  }

  async findByLogin(login: string): Promise<Driver | undefined> {
    const record = await this.store.findByLogin(login);
    if (!record) return;
    return { id: record.id, name: record.name, car: record.car };
  }

  async update(id: number, updates: Partial<Driver>): Promise<Driver> {
    const record = await this.store.update(id, { name: updates.name, car: updates.car });
    return { id: record.id, name: record.name, car: record.car };
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
