import type { DriverOrder, Order, OrderChatMessage, PassengerOrder } from '@packages/shared';
import { OrderChatMessageStore } from '../stores/OrderChatMessageStore.js';

export class OrderChatService {
  constructor(private readonly store: OrderChatMessageStore) {}

  async messages(order: PassengerOrder | DriverOrder): Promise<OrderChatMessage[]> {
    const rows = await this.store.listByOrderId(order.id);
    return rows.map(({ id, authorRole, text, createdAt }) => ({
      id,
      authorRole,
      text,
      createdAt,
    }));
  }

  async sendMessage(order: PassengerOrder | DriverOrder, message: Partial<OrderChatMessage>): Promise<void> {
    const text = (message.text ?? '').trim();
    if (!text) throw Error('Сообщение не должно быть пустым');
    if (!message.authorRole) throw Error('Роль автора сообщения должна быть указана');

    await this.store.create({
      orderId: order.id,
      authorRole: message.authorRole,
      text,
      createdAt: new Date().toISOString(),
    });
  }
}
