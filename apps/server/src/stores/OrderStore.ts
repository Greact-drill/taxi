import type { Order } from '@packages/shared';

export class OrderStore {
  private orderStore = new Map<number, Order>();
  private nextId = 1;

  async create(data: Omit<Order, 'id'>): Promise<Order> {
    const order: Order = { ...data, id: this.nextId++ };
    this.orderStore.set(order.id, order);
    return order;
  }

  async listWhere(match: (order: Order) => boolean): Promise<Order[]> {
    const items: Order[] = [];
    for (const order of this.orderStore.values()) {
      if (match(order)) items.push(order);
    }
    return items;
  }

  async findById(id: number): Promise<Order | undefined> {
    return this.orderStore.get(id);
  }

  async update(id: number, patch: Partial<Order>): Promise<Order> {
    const record = this.orderStore.get(id);
    if (!record) throw Error(`OrderStore: Record not found ${id}`);
    Object.assign(record, patch, { id });
    return record;
  }

  async delete(id: number): Promise<Order> {
    const record = this.orderStore.get(id);
    if (!record) throw Error(`OrderStore: Record not found ${id}`);
    this.orderStore.delete(id);
    return record;
  }
}
