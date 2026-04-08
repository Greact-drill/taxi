import type { Order } from '@packages/shared';
import { OrderStore } from '../stores/OrderStore.js';

export class OrderService {
  constructor(private orders: OrderStore) {}

  listOrders(passengerId: number): Order[] {
    return this.orders.listByPassengerId(passengerId);
  }

  getOrder(passengerId: number, orderId: number): Order | null {
    const order = this.orders.findById(orderId);
    if (!order) return null;
    if (order.passengerId !== passengerId) return null;
    return order;
  }

  createOrder(passengerId: number, from: string, to: string): Order {
    return this.orders.createWithNewId({
      from,
      to,
      passengerId,
    });
  }

  updateOrder(passengerId: number, id: number, patch: { from: string; to: string }): Order | null {
    const existing = this.orders.findById(id);
    if (!existing) return null;
    if (existing.passengerId !== passengerId) return null;

    const updated: Order = { ...existing, ...patch };
    return this.orders.update(updated);
  }

  deleteOrder(passengerId: number, id: number): boolean {
    const existing = this.orders.findById(id);
    if (!existing) return false;
    if (existing.passengerId !== passengerId) return false;
    this.orders.delete(id);
    return true;
  }
}

