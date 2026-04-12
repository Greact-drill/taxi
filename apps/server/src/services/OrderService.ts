import {
  OrderStatus,
  type Order,
  type Passenger,
  type PassengerOrder,
  type DriverOrder,
} from '@packages/shared';
import { OrderStore } from '../stores/OrderStore.js';

export class OrderService {
  constructor(private readonly store: OrderStore) {}

  async create(input: Partial<PassengerOrder>, passenger: Passenger): Promise<Order> {
    const from = (input.from ?? '').trim();
    const to = (input.to ?? '').trim();
    const canSubmit = passenger && from.length > 0 && to.length > 0;
    if (!canSubmit) {
      throw new Error(`Некорректные данные заказа: ${from} ${to}`);
    }

    return await this.store.create({
      passenger,
      from,
      to,
      status: input.status ?? OrderStatus.AWAITING_DRIVER,
      createdAt: new Date().toISOString(),
    });
  }

  async listOfPassenger(passengerId: number): Promise<PassengerOrder[]> {
    return (await this.store.listWhere((order) => order.passenger.id === passengerId)) as PassengerOrder[];
  }

  async listOfDriver(driverId: number): Promise<DriverOrder[]> {
    return (await this.store.listWhere((order) => order.driver?.id === driverId)) as DriverOrder[];
  }

  async listOfActive(): Promise<DriverOrder[]> {
    return (await this.store.listWhere((order) => order.status === OrderStatus.AWAITING_DRIVER)) as DriverOrder[];
  }

  async findById(id: number): Promise<Order | undefined> {
    return await this.store.findById(id);
  }

  async update(id: number, patch: Partial<Order>): Promise<Order> {
    return await this.store.update(id, patch);
  }

  async delete(id: number): Promise<Order> {
    return await this.store.delete(id);
  }
}
