import {
  OrderStatus,
  type DriverOrder,
  type Order,
  type Passenger,
  type PassengerOrder,
} from '@packages/shared';
import type { OrderRecord } from '../generated/prisma/client';
import { OrderStore } from '../stores/OrderStore';
import { PassengerService } from './PassengerService';
import { DriverService } from './DriverService';

export class OrderService {
  constructor(
    private readonly store: OrderStore,
    private readonly passengerService: PassengerService,
    private readonly driverService: DriverService,
  ) { }

  private async toOrder(record: OrderRecord): Promise<Order> {
    const passenger = (await this.passengerService.getById(record.passengerId))!;
    const driver = record.driverId ? await this.driverService.getById(record.driverId) : undefined;
    const order: Order = {
      id: record.id,
      createdAt: record.createdAt,
      passenger,
      from: record.from,
      to: record.to,
      driver,
      status: record.status,
      cancelReason: record.cancelReason ?? undefined,
    };
    return order;
  }
  async create(input: Partial<PassengerOrder>, passenger: Passenger): Promise<Order> {
    const from = (input.from ?? '').trim();
    const to = (input.to ?? '').trim();
    const canSubmit = passenger && from.length > 0 && to.length > 0;
    if (!canSubmit) {
      throw new Error(`Некорректные данные заказа: ${from} ${to}`);
    }

    const record = await this.store.create({
      passengerId: passenger.id,
      from,
      to,
      status: input.status ?? OrderStatus.AWAITING_DRIVER,
      createdAt: new Date().toISOString(),
    });

    return this.toOrder(record);
  }

  async listOfPassenger(passengerId: number): Promise<PassengerOrder[]> {
    const records = await this.store.listByPassengerId(passengerId);
    const out: PassengerOrder[] = [];
    for (const r of records) {
      const order = await this.toOrder(r);
      const { passenger: _omit, ...passengerOrder } = order;
      out.push(passengerOrder);
    }
    return out;
  }

  async listOfDriver(driverId: number): Promise<DriverOrder[]> {
    const records = await this.store.listByDriverId(driverId);
    const out: DriverOrder[] = [];
    for (const record of records) {
      const order = await this.toOrder(record);
      const { driver: _omit, ...driverOrder } = order;
      out.push(driverOrder);
    }
    return out;
  }

  async listOfActive(): Promise<DriverOrder[]> {
    const records = await this.store.listActive();
    const out: DriverOrder[] = [];
    for (const record of records) {
      const order = await this.toOrder(record);
      const { driver: _omit, ...driverOrder } = order;
      out.push(driverOrder);
    }
    return out;
  }

  async findById(id: number): Promise<Order | undefined> {
    const record = await this.store.findById(id);
    if (!record) return;
    return this.toOrder(record);
  }

  async update(id: number, updates: Partial<PassengerOrder> | Partial<DriverOrder>): Promise<Order> {
    const patch: Partial<OrderRecord> = {
      from: updates.from,
      to: updates.to,
      status: updates.status,
    };
    if ('driver' in updates && updates.driver) {
      patch.driverId = updates.driver.id;
    }
    if (updates.status === OrderStatus.DRIVER_ASSIGNED) {
      patch.assignedAt = new Date().toISOString();
    }
    if (updates.status === OrderStatus.COMPLETED) {
      patch.completedAt = new Date().toISOString();
    }
    if (updates.status === OrderStatus.CANCELLED) {
      patch.cancelReason = updates.cancelReason;
      patch.completedAt = new Date().toISOString();
    }
    const record = await this.store.update(id, patch);
    return this.toOrder(record);
  }

  async delete(id: number): Promise<void> {
    await this.store.delete(id);
  }
}
