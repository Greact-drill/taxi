import { randomUUID } from 'node:crypto';
import type { Prisma, PrismaClient, DriverRecord } from '../generated/prisma/client.js';

const active = { deleted: false } as const;

export class DriverStore {
  constructor(private readonly prisma: PrismaClient) { }

  async create(data: Prisma.DriverRecordUncheckedCreateInput): Promise<DriverRecord> {
    return this.prisma.driverRecord.create({ data });
  }

  async findByLogin(login: string): Promise<DriverRecord | null> {
    return this.prisma.driverRecord.findUnique({ where: { login } });
  }

  async findByToken(token: string): Promise<DriverRecord | null> {
    return this.prisma.driverRecord.findUnique({ where: { token } });
  }

  async getById(id: number): Promise<DriverRecord | null> {
    return this.prisma.driverRecord.findUnique({ where: { id } });
  }

  async update(
    id: number,
    patch: { name?: string; car?: string; login?: string; hash?: string; token?: string },
  ): Promise<DriverRecord> {
    const data: Prisma.DriverRecordUncheckedUpdateInput = {};

    if (patch.name !== undefined) data.name = patch.name;
    if (patch.car !== undefined) data.car = patch.car;
    if (patch.login !== undefined) data.login = patch.login;
    if (patch.hash !== undefined) data.hash = patch.hash;
    if (patch.token !== undefined) data.token = patch.token;

    return this.prisma.driverRecord.update({
      where: { id },
      data,
    });
  }

  async list(): Promise<DriverRecord[]> {
    return this.prisma.driverRecord.findMany({
      where: active,
      orderBy: { id: 'asc' },
    });
  }

  async delete(id: number): Promise<DriverRecord> {
    const existing = await this.getById(id);
    if (!existing || existing.deleted) {
      throw new Error(`DriverStore: Водитель не найден: ${id}`);
    }

    return this.prisma.driverRecord.update({
      where: { id },
      data: {
        deleted: true,
        deletedAt: new Date().toISOString(),
        token: null,
        hash: '',
      },
    });
  }
}
