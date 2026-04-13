import type { OrderChatMessageRecord } from '@packages/shared';

export class OrderChatMessageStore {
  private records: OrderChatMessageRecord[] = [];
  private nextId = 1;

  async listByOrderId(orderId: number): Promise<OrderChatMessageRecord[]> {
    return this.records.filter((item) => item.orderId === orderId);
  }

  async create(data: Omit<OrderChatMessageRecord, 'id'>): Promise<OrderChatMessageRecord> {
    const record: OrderChatMessageRecord = {
      id: this.nextId++,
      ...data,
    };
    this.records.push(record);
    return record;
  }
}
