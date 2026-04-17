import type { Prisma, PrismaClient, OrderChatMessageRecord } from '../generated/prisma/client.js';

export class OrderChatMessageStore {
  constructor(private readonly prisma: PrismaClient) {}

  async listByOrderId(orderId: number): Promise<OrderChatMessageRecord[]> {
    return this.prisma.orderChatMessageRecord.findMany({
      where: { orderId },
      orderBy: { id: 'asc' },
    });
  }

  async create(data: Prisma.OrderChatMessageRecordUncheckedCreateInput): Promise<OrderChatMessageRecord> {
    return this.prisma.orderChatMessageRecord.create({ data });
  }
}
