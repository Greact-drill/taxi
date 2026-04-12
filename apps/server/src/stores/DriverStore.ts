import type { DriverRecord } from '@packages/shared';

export class DriverStore {
  private driverStore = new Map<number, DriverRecord>();
  private nextId = 1;

  async create(data: Omit<DriverRecord, 'id'>): Promise<DriverRecord> {
    const driver: DriverRecord = { ...data, id: this.nextId++ };
    this.driverStore.set(driver.id, driver);
    return driver;
  }

  async findWhere(match: (driver: DriverRecord) => boolean): Promise<DriverRecord | undefined> {
    for (const driver of this.driverStore.values()) {
      if (match(driver)) return driver;
    }
  }

  async getById(id: number): Promise<DriverRecord | undefined> {
    return this.driverStore.get(id);
  }

  async update(id: number, patch: Partial<DriverRecord>): Promise<DriverRecord> {
    const record = this.driverStore.get(id);
    if (!record) throw Error(`DriverStore: Record not found ${id}`);
    Object.assign(record, patch, { id });
    return record;
  }
}
