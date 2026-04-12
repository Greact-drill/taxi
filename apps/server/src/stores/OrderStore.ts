import type { OrderRecord } from '@packages/shared';

export class OrderStore {
  private orderStore = new Map<number, OrderRecord>();
  private nextId = 1;

  async create(data: Omit<OrderRecord, 'id'>): Promise<OrderRecord> {
    const order: OrderRecord = { ...data, id: this.nextId++ };
    this.orderStore.set(order.id, order);
    return order;
  }

  async listWhere(match: (order: OrderRecord) => boolean): Promise<OrderRecord[]> {
    const items: OrderRecord[] = [];
    for (const order of this.orderStore.values()) {
      if (order.deleted) continue;
      if (match(order)) items.push(order);
    }
    return items;
  }

  async findById(id: number): Promise<OrderRecord | undefined> {
    const order = this.orderStore.get(id);
    if (!order || order.deleted) return;
    return order;
  }

  async update(id: number, patch: Partial<OrderRecord>): Promise<OrderRecord> {
    const record = this.orderStore.get(id);
    if (!record || record.deleted) throw Error(`OrderStore: Record not found ${id}`);
    Object.assign(record, patch, { id });
    return record;
  }

  async delete(id: number): Promise<OrderRecord> {
    const record = this.orderStore.get(id);
    if (!record || record.deleted) throw Error(`OrderStore: Record not found ${id}`);
    record.deleted = true;
    record.deletedAt = new Date().toISOString();
    return record;
  }
}
