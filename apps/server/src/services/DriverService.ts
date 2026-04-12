import { randomUUID } from 'node:crypto';
import type { Driver, DriverLogin } from '@packages/shared';
import { makePasswordHash, verifyPassword } from '../password.js';
import { DriverStore } from '../stores/DriverStore.js';

export type DriverCreateInput = {
  name: string;
  car: string;
  login: string;
  password: string;
};

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

    return await this.store.create({
      name,
      car,
      login,
      hash: await makePasswordHash(password),
      token: randomUUID(),
    });
  }

  async login(data: DriverLogin): Promise<Driver> {
    const login = data.login.trim();
    const driver = await this.findByLogin(login);
    if (!driver || !(await verifyPassword(data.password, driver.hash))) {
      throw new Error('Неверный логин или пароль');
    }
    return driver;
  }

  async findByToken(token: string): Promise<Driver | undefined> {
    return await this.store.findWhere((driver) => driver.token === token);
  }

  async findByLogin(login: string): Promise<Driver | undefined> {
    return await this.store.findWhere((driver) => driver.login === login);
  }

  async update(id: number, updates: Partial<Driver>): Promise<Driver> {
    return await this.store.update(id, updates);
  }

  async bootstrap(): Promise<void> {
    const seeds: DriverCreateInput[] = [
      { name: 'Иван Петров', car: 'Kia Rio · A111AA77', login: '1', password: '1' },
      { name: 'Сергей Козлов', car: 'VW Polo · B222BB77', login: 'driver2', password: 'driver2' },
      { name: 'Алексей Смирнов', car: 'Skoda Rapid · C333CC77', login: 'driver3', password: 'driver3' },
      { name: 'Дмитрий Волков', car: 'Renault Logan · E444EE77', login: 'driver4', password: 'driver4' },
      { name: 'Андрей Новиков', car: 'Lada Vesta · K555KK77', login: 'driver5', password: 'driver5' },
      { name: 'Михаил Орлов', car: 'Hyundai Solaris · M666MM77', login: 'driver6', password: 'driver6' },
      { name: 'Николай Соколов', car: 'Toyota Camry · O777OO77', login: 'driver7', password: 'driver7' },
      { name: 'Павел Лебедев', car: 'Kia Optima · P888PP77', login: 'driver8', password: 'driver8' },
      { name: 'Егор Морозов', car: 'Mazda 6 · T999TT77', login: 'driver9', password: 'driver9' },
      { name: 'Константин Егоров', car: 'Haval Jolion · X000XX77', login: 'driver10', password: 'driver10' },
    ];
    for (const input of seeds) {
      if (!(await this.findByLogin(input.login))) {
        await this.create(input);
      }
    }
  }
}
