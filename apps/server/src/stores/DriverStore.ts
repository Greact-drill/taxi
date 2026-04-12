import type { Driver } from '@packages/shared';

export class DriverStore {
  private driverStore = new Map<number, Driver>();
  private nextId = 1;

  async create(data: Omit<Driver, 'id'>): Promise<Driver> {
    const driver: Driver = { ...data, id: this.nextId++ };
    this.driverStore.set(driver.id, driver);
    return driver;
  }

  async findWhere(match: (driver: Driver) => boolean): Promise<Driver | undefined> {
    for (const driver of this.driverStore.values()) {
      if (match(driver)) return driver;
    }
  }

  async getById(id: number): Promise<Driver | undefined> {
    return this.driverStore.get(id);
  }

  async update(id: number, patch: Partial<Driver>): Promise<Driver> {
    const record = this.driverStore.get(id);
    if (!record) throw Error(`DriverStore: Record not found ${id}`);
    Object.assign(record, patch, { id });
    return record;
  }
}
