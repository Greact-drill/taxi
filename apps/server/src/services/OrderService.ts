import {
  OrderStatus,
  type DriverOrder,
  type Order,
  type OrderRecord,
  type Passenger,
  type PassengerOrder,
} from '@packages/shared';
import { OrderStore } from '../stores/OrderStore.js';
import { PassengerService } from './PassengerService.js';
import { DriverService } from './DriverService.js';

export class OrderService {
  constructor(
    private readonly store: OrderStore,
    private readonly passengerService: PassengerService,
    private readonly driverService: DriverService,
  ) { }

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

    return {
      id: record.id,
      passenger: passenger,
      from: record.from,
      to: record.to,
      status: record.status,
      createdAt: record.createdAt,
    };
  }

  async listOfPassenger(passengerId: number): Promise<PassengerOrder[]> {
    const rows = await this.store.listWhere((order) => order.passengerId === passengerId);
    const out: PassengerOrder[] = [];
    for (const r of rows) {
      out.push({
        id: r.id,
        createdAt: r.createdAt,
        from: r.from,
        to: r.to,
        driver: r.driverId ? await this.driverService.getById(r.driverId) : undefined,
        status: r.status,
        cancelReason: r.cancelReason,
      });
    }
    return out;
  }

  async listOfDriver(driverId: number): Promise<DriverOrder[]> {
    const rows = await this.store.listWhere((order) => order.driverId === driverId);
    const out: DriverOrder[] = [];
    for (const record of rows) {
      out.push({
        id: record.id,
        createdAt: record.createdAt,
        passenger: (await this.passengerService.getById(record.passengerId))!,
        from: record.from,
        to: record.to,
        status: record.status,
        cancelReason: record.cancelReason,
      });
    }
    return out;
  }

  async listOfActive(): Promise<DriverOrder[]> {
    const rows = await this.store.listWhere((order) => order.status === OrderStatus.AWAITING_DRIVER);
    const out: DriverOrder[] = [];
    for (const record of rows) {
      out.push({
        id: record.id,
        createdAt: record.createdAt,
        passenger: (await this.passengerService.getById(record.passengerId))!,
        from: record.from,
        to: record.to,
        status: record.status,
      });
    }
    return out;
  }

  async findById(id: number): Promise<Order | undefined> {
    const record = await this.store.findById(id);
    if (!record) throw new Error(`Заказ не найден: ${id}`);
    return {
      id: record.id,
      createdAt: record.createdAt,
      passenger: (await this.passengerService.getById(record.passengerId))!,
      from: record.from,
      to: record.to,
      driver: record.driverId ? await this.driverService.getById(record.driverId) : undefined,
      status: record.status,
      cancelReason: record.cancelReason,
    };
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

    return {
      id: record.id,
      createdAt: record.createdAt,
      passenger: (await this.passengerService.getById(record.passengerId))!,
      from: record.from,
      to: record.to,
      driver: record.driverId ? await this.driverService.getById(record.driverId) : undefined,
      status: record.status,
      cancelReason: record.cancelReason,
    };
  }

  async delete(id: number): Promise<Order> {
    const record = await this.store.delete(id);
    return {
      id: record.id,
      createdAt: record.createdAt,
      passenger: (await this.passengerService.getById(record.passengerId))!,
      from: record.from,
      to: record.to,
      driver: record.driverId ? await this.driverService.getById(record.driverId) : undefined,
      status: record.status,
      cancelReason: record.cancelReason,
    };
  }
}
