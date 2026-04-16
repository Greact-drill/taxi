import type { OrderChatMessageRecord } from '@packages/shared';
import { mapOrderChatMessageRow } from '../db/mappers.js';
import { toPrismaChatAuthorRole } from '../db/mappers.js';
import type { PrismaClient } from '../generated/prisma/client.js';
import type { OrderChatMessageStoreRepository } from './contracts.js';

export class OrderChatMessageStore implements OrderChatMessageStoreRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listByOrderId(orderId: number): Promise<OrderChatMessageRecord[]> {
    const rows = await this.prisma.orderChatMessage.findMany({
      where: { orderId },
      orderBy: { id: 'asc' },
    });
    return rows.map(mapOrderChatMessageRow);
  }

  async create(data: Omit<OrderChatMessageRecord, 'id'>): Promise<OrderChatMessageRecord> {
    const record = await this.prisma.orderChatMessage.create({
      data: {
        orderId: data.orderId,
        authorRole: toPrismaChatAuthorRole(data.authorRole),
        text: data.text,
        createdAt: new Date(data.createdAt),
      },
    });
    return mapOrderChatMessageRow(record);
  }
}
