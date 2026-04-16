import type { PassengerRecord } from '@packages/shared';
import { mapPassengerRow } from '../db/mappers.js';
import { isPrismaRecordNotFound } from '../db/prisma.js';
import type { PrismaClient } from '../generated/prisma/client.js';
import type { PassengerStoreRepository } from './contracts.js';

export class PassengerStore implements PassengerStoreRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Omit<PassengerRecord, 'id'>): Promise<PassengerRecord> {
    const passenger = await this.prisma.passenger.create({
      data: {
        name: data.name,
        phone: data.phone,
        token: data.token,
      },
    });
    return mapPassengerRow(passenger);
  }

  async findByToken(token: string): Promise<PassengerRecord | undefined> {
    const passenger = await this.prisma.passenger.findUnique({
      where: { token },
    });
    return passenger ? mapPassengerRow(passenger) : undefined;
  }

  async getById(id: number): Promise<PassengerRecord | undefined> {
    const passenger = await this.prisma.passenger.findUnique({
      where: { id },
    });
    return passenger ? mapPassengerRow(passenger) : undefined;
  }

  async update(id: number, patch: Partial<PassengerRecord>): Promise<PassengerRecord> {
    const data = {
      ...(patch.name !== undefined ? { name: patch.name } : {}),
      ...(patch.phone !== undefined ? { phone: patch.phone } : {}),
      ...(patch.token !== undefined ? { token: patch.token } : {}),
    };

    if (Object.keys(data).length === 0) {
      const record = await this.getById(id);
      if (!record) throw Error(`PassengerStore: Record not found ${id}`);
      return record;
    }

    try {
      const passenger = await this.prisma.passenger.update({
        where: { id },
        data,
      });
      return mapPassengerRow(passenger);
    } catch (error) {
      if (isPrismaRecordNotFound(error)) {
        throw Error(`PassengerStore: Record not found ${id}`);
      }
      throw error;
    }
  }
}
