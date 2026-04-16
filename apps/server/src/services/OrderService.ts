import {
  OrderStatus,
  type DriverOrder,
  type Order,
  type OrderRecord,
  type Passenger,
  type PassengerOrder,
} from '@packages/shared';
import { OrderStore } from '../stores/OrderStore';
import { PassengerService } from './PassengerService';
import { DriverService } from './DriverService';

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

    const { id, createdAt, status } = record;

    return {
      id,
      createdAt,
      passenger,
      from,
      to,
      status
    };
  }

  async listOfPassenger(passengerId: number): Promise<PassengerOrder[]> {
    const records = await this.store.listWhere((order) => order.passengerId === passengerId);
    const out: PassengerOrder[] = [];
    for (const record of records) {
      const {
        id,
        from,
        to,
        driverId,
        status,
        cancelReason,
        createdAt,
        assignedAt,
        completedAt,
      } = record;
      const driver = driverId ? await this.driverService.getById(driverId) : undefined;
      const order: PassengerOrder = {
        id,
        createdAt,
        from,
        to,
        driver,
        status,
        cancelReason,
        assignedAt,
        completedAt,
      };
      out.push(order);
    }
    return out;
  }

  async listOfDriver(driverId: number): Promise<DriverOrder[]> {
    const records = await this.store.listWhere((order) => order.driverId === driverId);
    const out: DriverOrder[] = [];
    for (const record of records) {
      const {
        id,
        from,
        to,
        passengerId,
        status,
        cancelReason,
        createdAt,
        assignedAt,
        completedAt,
      } = record;
      const passenger = (await this.passengerService.getById(passengerId))!;
      const driverOrder: DriverOrder = {
        id,
        createdAt,
        from,
        to,
        passenger,
        status,
        cancelReason,
        assignedAt,
        completedAt,
      };
      out.push(driverOrder);
    }
    return out;
  }

  async listOfActive(): Promise<DriverOrder[]> {
    const records = await this.store.listWhere((order) => order.status === OrderStatus.AWAITING_DRIVER);
    const out: DriverOrder[] = [];
    for (const record of records) {
      const {
        id,
        from,
        to,
        passengerId,
        status,
        cancelReason,
        createdAt,
        assignedAt,
        completedAt,
      } = record;
      const passenger = (await this.passengerService.getById(passengerId))!;
      const driverOrder: DriverOrder = {
        id,
        createdAt,
        from,
        to,
        passenger,
        status,
        cancelReason,
        assignedAt,
        completedAt,
      };
      out.push(driverOrder);
    }
    return out;
  }

  async findById(id: number): Promise<Order | undefined> {
    const record = await this.store.findById(id);
    if (!record) return;
    const {
      from,
      to,
      driverId,
      passengerId,
      status,
      cancelReason,
      createdAt,
      assignedAt,
      completedAt,
    } = record;
    const passenger = (await this.passengerService.getById(passengerId))!;
    const driver = driverId ? await this.driverService.getById(driverId) : undefined;
    return {
      id,
      createdAt,
      passenger,
      from,
      to,
      driver,
      status,
      cancelReason,
      assignedAt,
      completedAt,
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
    const {
      from,
      to,
      driverId,
      passengerId,
      status,
      cancelReason,
      createdAt,
      assignedAt,
      completedAt,
    } = record;
    const passenger = (await this.passengerService.getById(passengerId))!;
    const driver = driverId ? await this.driverService.getById(driverId) : undefined;
    return {
      id,
      createdAt,
      passenger,
      from,
      to,
      driver,
      status,
      cancelReason,
      assignedAt,
      completedAt,
    };
  }

  async delete(id: number): Promise<void> {
    await this.store.delete(id);
  }
}
