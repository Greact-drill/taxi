import { OrderStatus, type OrderRecord } from '@packages/shared';
import { mapOrderRow, toPrismaOrderStatus } from '../db/mappers.js';
import { isPrismaRecordNotFound } from '../db/prisma.js';
import type { PrismaClient } from '../generated/prisma/client.js';
import type { OrderStoreRepository } from './contracts.js';

export class OrderStore implements OrderStoreRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Omit<OrderRecord, 'id'>): Promise<OrderRecord> {
    const order = await this.prisma.order.create({
      data: {
        passengerId: data.passengerId,
        from: data.from,
        to: data.to,
        driverId: data.driverId ?? null,
        status: toPrismaOrderStatus(data.status),
        cancelReason: data.cancelReason ?? null,
        deleted: data.deleted ?? false,
        createdAt: new Date(data.createdAt),
        assignedAt: data.assignedAt ? new Date(data.assignedAt) : null,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
        deletedAt: data.deletedAt ? new Date(data.deletedAt) : null,
      },
    });
    return mapOrderRow(order);
  }

  async listByPassengerId(passengerId: number): Promise<OrderRecord[]> {
    const rows = await this.prisma.order.findMany({
      where: {
        passengerId,
        deleted: false,
      },
      orderBy: {
        id: 'asc',
      },
    });
    return rows.map(mapOrderRow);
  }

  async listByDriverId(driverId: number): Promise<OrderRecord[]> {
    const rows = await this.prisma.order.findMany({
      where: {
        driverId,
        deleted: false,
      },
      orderBy: {
        id: 'asc',
      },
    });
    return rows.map(mapOrderRow);
  }

  async listActive(): Promise<OrderRecord[]> {
    const rows = await this.prisma.order.findMany({
      where: {
        status: toPrismaOrderStatus(OrderStatus.AWAITING_DRIVER),
        deleted: false,
      },
      orderBy: {
        id: 'asc',
      },
    });
    return rows.map(mapOrderRow);
  }

  async findById(id: number): Promise<OrderRecord | undefined> {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        deleted: false,
      },
    });
    return order ? mapOrderRow(order) : undefined;
  }

  async update(id: number, patch: Partial<OrderRecord>): Promise<OrderRecord> {
    const data = {
      ...(patch.passengerId !== undefined ? { passengerId: patch.passengerId } : {}),
      ...(patch.from !== undefined ? { from: patch.from } : {}),
      ...(patch.to !== undefined ? { to: patch.to } : {}),
      ...(patch.driverId !== undefined ? { driverId: patch.driverId ?? null } : {}),
      ...(patch.status !== undefined ? { status: toPrismaOrderStatus(patch.status) } : {}),
      ...(patch.cancelReason !== undefined ? { cancelReason: patch.cancelReason ?? null } : {}),
      ...(patch.deleted !== undefined ? { deleted: patch.deleted } : {}),
      ...(patch.createdAt !== undefined ? { createdAt: new Date(patch.createdAt) } : {}),
      ...(patch.assignedAt !== undefined ? { assignedAt: patch.assignedAt ? new Date(patch.assignedAt) : null } : {}),
      ...(patch.completedAt !== undefined ? { completedAt: patch.completedAt ? new Date(patch.completedAt) : null } : {}),
      ...(patch.deletedAt !== undefined ? { deletedAt: patch.deletedAt ? new Date(patch.deletedAt) : null } : {}),
    };

    if (Object.keys(data).length === 0) {
      const record = await this.findById(id);
      if (!record) throw Error(`OrderStore: Record not found ${id}`);
      return record;
    }

    try {
      const order = await this.prisma.order.update({
        where: { id },
        data,
      });
      if (order.deleted) {
        throw Error(`OrderStore: Record not found ${id}`);
      }
      return mapOrderRow(order);
    } catch (error) {
      if (isPrismaRecordNotFound(error)) {
        throw Error(`OrderStore: Record not found ${id}`);
      }
      throw error;
    }
  }

  async delete(id: number): Promise<OrderRecord> {
    const existing = await this.findById(id);
    if (!existing) throw Error(`OrderStore: Record not found ${id}`);

    const order = await this.prisma.order.update({
      where: { id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });
    return mapOrderRow(order);
  }
}
