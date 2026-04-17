import { OrderStatus } from '@packages/shared';
import type { Prisma, PrismaClient, OrderRecord } from '../generated/prisma/client';

export class OrderStore {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Prisma.OrderRecordUncheckedCreateInput): Promise<OrderRecord> {
    return this.prisma.orderRecord.create({ data });
  }

  async listByPassengerId(passengerId: number): Promise<OrderRecord[]> {
    return this.prisma.orderRecord.findMany({
      where: { passengerId, deleted: false },
      orderBy: { id: 'asc' },
    });
  }

  async listByDriverId(driverId: number): Promise<OrderRecord[]> {
    return this.prisma.orderRecord.findMany({
      where: { driverId, deleted: false },
      orderBy: { id: 'asc' },
    });
  }

  async listActive(): Promise<OrderRecord[]> {
    return this.prisma.orderRecord.findMany({
      where: {
        status: OrderStatus.AWAITING_DRIVER,
        deleted: false,
      },
      orderBy: { id: 'asc' },
    });
  }

  async findById(id: number): Promise<OrderRecord | null> {
    return (
      await this.prisma.orderRecord.findUnique({
        where: { id, deleted: false },
      })
    );
  }

  async update(
    id: number,
    patch: {
      from?: string;
      to?: string;
      driverId?: number | null;
      status?: OrderRecord['status'];
      cancelReason?: string | null;
      deleted?: boolean;
      createdAt?: string;
      assignedAt?: string | null;
      completedAt?: string | null;
      deletedAt?: string | null;
    },
  ): Promise<OrderRecord> {
    const existing = await this.findById(id);
    if (!existing) throw Error(`OrderStore: Record not found ${id}`);

    const data: Prisma.OrderRecordUncheckedUpdateInput = {};

    if (patch.from !== undefined) data.from = patch.from;
    if (patch.to !== undefined) data.to = patch.to;
    if (patch.driverId !== undefined) data.driverId = patch.driverId;
    if (patch.status !== undefined) data.status = patch.status;
    if (patch.cancelReason !== undefined) data.cancelReason = patch.cancelReason;
    if (patch.deleted !== undefined) data.deleted = patch.deleted;
    if (patch.createdAt !== undefined) data.createdAt = patch.createdAt;
    if (patch.assignedAt !== undefined) data.assignedAt = patch.assignedAt;
    if (patch.completedAt !== undefined) data.completedAt = patch.completedAt;
    if (patch.deletedAt !== undefined) data.deletedAt = patch.deletedAt;

    return this.prisma.orderRecord.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<OrderRecord> {
    const existing = await this.findById(id);
    if (!existing) throw Error(`OrderStore: Record not found ${id}`);

    return this.prisma.orderRecord.update({
      where: { id },
      data: {
        deleted: true,
        deletedAt: new Date().toISOString(),
      },
    });
  }
}
