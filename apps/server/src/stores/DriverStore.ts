import type { DriverRecord } from '@packages/shared';
import { mapDriverRow } from '../db/mappers.js';
import { isPrismaRecordNotFound } from '../db/prisma.js';
import type { PrismaClient } from '../generated/prisma/client.js';
import type { DriverStoreRepository } from './contracts.js';

export class DriverStore implements DriverStoreRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Omit<DriverRecord, 'id'>): Promise<DriverRecord> {
    const driver = await this.prisma.driver.create({
      data: {
        name: data.name,
        car: data.car,
        login: data.login,
        hash: data.hash,
        token: data.token,
      },
    });
    return mapDriverRow(driver);
  }

  async findByLogin(login: string): Promise<DriverRecord | undefined> {
    const driver = await this.prisma.driver.findUnique({
      where: { login },
    });
    return driver ? mapDriverRow(driver) : undefined;
  }

  async findByToken(token: string): Promise<DriverRecord | undefined> {
    const driver = await this.prisma.driver.findUnique({
      where: { token },
    });
    return driver ? mapDriverRow(driver) : undefined;
  }

  async getById(id: number): Promise<DriverRecord | undefined> {
    const driver = await this.prisma.driver.findUnique({
      where: { id },
    });
    return driver ? mapDriverRow(driver) : undefined;
  }

  async update(id: number, patch: Partial<DriverRecord>): Promise<DriverRecord> {
    const data = {
      ...(patch.name !== undefined ? { name: patch.name } : {}),
      ...(patch.car !== undefined ? { car: patch.car } : {}),
      ...(patch.login !== undefined ? { login: patch.login } : {}),
      ...(patch.hash !== undefined ? { hash: patch.hash } : {}),
      ...(patch.token !== undefined ? { token: patch.token } : {}),
    };

    if (Object.keys(data).length === 0) {
      const record = await this.getById(id);
      if (!record) throw Error(`DriverStore: Record not found ${id}`);
      return record;
    }

    try {
      const driver = await this.prisma.driver.update({
        where: { id },
        data,
      });
      return mapDriverRow(driver);
    } catch (error) {
      if (isPrismaRecordNotFound(error)) {
        throw Error(`DriverStore: Record not found ${id}`);
      }
      throw error;
    }
  }
}
