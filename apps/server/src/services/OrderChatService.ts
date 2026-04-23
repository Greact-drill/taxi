import { type DriverOrder, type PassengerOrder, ChatAuthorRole, type OrderChatMessage } from '@packages/shared';
import type { OrderChatMessageRecord, Prisma } from '../generated/prisma/client.js';

export class OrderChatService {
  constructor(private readonly orm: Prisma.OrderChatMessageRecordDelegate) { }

  async messages(order: PassengerOrder | DriverOrder): Promise<OrderChatMessage[]> {
    const records = await this.orm.findMany({
      where: { orderId: order.id },
      orderBy: { createdAt: 'asc' },
    });

    return records.map((record: OrderChatMessageRecord): OrderChatMessage => ({
      id: record.id,
      authorRole: record.authorRole as ChatAuthorRole,
      text: record.text,
      createdAt: record.createdAt,
    }));
  }

  async sendMessage(order: PassengerOrder | DriverOrder, input: Partial<OrderChatMessage>): Promise<void> {
    if (!input.text) throw Error('Сообщение не должно быть пустым');
    if (!input.authorRole) throw Error('Роль автора сообщения должна быть указана');

    await this.orm.create({
      data: {
        orderId: order.id,
        authorRole: input.authorRole,
        text: input.text,
        createdAt: new Date().toISOString(),
      },
    });
  }
}
