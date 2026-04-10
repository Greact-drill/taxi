import { DriverOrder, OrderStatus, type Order, type PassengerOrder } from '@packages/shared';

export class OrderStore {
  private orderStore = new Map<number, Order>();
  private nextId = 1;

  create(input: Partial<Order>): Order {
    const passenger = input.passenger;
    const from = (input.from ?? '').trim();
    const to = (input.to ?? '').trim();
    const canSubmit = passenger && from.length > 0 && to.length > 0;
    // TODO validation messages
    if (!canSubmit) {
      throw Error(`Некорректные данные заказа: ${from} ${to}`);
    }

    const order: Order = {
      id: this.nextId++,
      passenger,
      from,
      to,
      status: input.status ?? OrderStatus.AWAITING_DRIVER,
      createdAt: new Date().toISOString(),
    };
    this.orderStore.set(order.id, order);
    return order;
  }

  listOfPassenger(passengerId: number): PassengerOrder[] {
    const items: Order[] = [];
    for (const order of this.orderStore.values()) {
      if (order.passenger.id === passengerId) items.push(order);
    }
    return items;
  }

  listOfDriver(driverId: number): DriverOrder[] {
    const items: DriverOrder[] = [];
    for (const order of this.orderStore.values()) {
      if (order.driver?.id === driverId) items.push(order);
    }
    return items;
  }

  listOfActive(): DriverOrder[] {
    const items: DriverOrder[] = [];
    for (const order of this.orderStore.values()) {
      if (order.status === OrderStatus.AWAITING_DRIVER) items.push(order);
    }
    return items;
  }

  findById(id: number): Order | null {
    return this.orderStore.get(id) ?? null;
  }

  update(id: number, patch: Partial<Order>): Order | undefined {
    const record = this.orderStore.get(id);
    if (!record) return undefined;
    Object.assign(record, patch, { id });
    return record;
  }

  delete(id: number): void {
    this.orderStore.delete(id);
  }
}

