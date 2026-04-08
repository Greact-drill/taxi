import type { Order } from '@packages/shared';

export class OrderStore {
  private orderStore = new Map<number, Order>();
  private nextId = 1;

  create(order: Order): Order {
    this.orderStore.set(order.id, order);
    return order;
  }

  listByPassengerId(passengerId: number): Order[] {
    const items: Order[] = [];
    for (const order of this.orderStore.values()) {
      if (order.passengerId === passengerId) items.push(order);
    }
    return items;
  }

  createWithNewId(input: Omit<Order, 'id'>): Order {
    const order: Order = { ...input, id: this.nextId++ };
    this.orderStore.set(order.id, order);
    return order;
  }

  findById(id: number): Order | null {
    return this.orderStore.get(id) ?? null;
  }

  update(order: Order): Order {
    this.orderStore.set(order.id, order);
    return order;
  }

  delete(id: number): void {
    this.orderStore.delete(id);
  }
}

