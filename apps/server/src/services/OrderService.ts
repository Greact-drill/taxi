import {
  Driver,
  OrderCreateInput,
  OrderStatus,
  type DriverOrder,
  type Order,
  type Passenger,
  type PassengerOrder,
} from '@packages/shared';
import type { OrderRecord, Prisma } from '../generated/prisma/client.js';

const dto = {
  passenger: { select: { id: true, name: true, phone: true } },
  driver: { select: { id: true, name: true, car: true } },
};
export class OrderService {
  constructor(private readonly orm: Prisma.OrderRecordDelegate) { }

  async create(input: OrderCreateInput, passenger: Passenger): Promise<Order> {
    const { from, to } = input;

    const { id, createdAt, status } = await this.orm.create({ 
      data:{
        passengerId: passenger.id,
        from,
        to,
        status: OrderStatus.AWAITING_DRIVER,
        createdAt: new Date().toISOString(),
      }
     });

    return { id, createdAt, from, to, status: status as OrderStatus, passenger };
  }

  async listOfPassenger(passengerId: number): Promise<PassengerOrder[]> {
    const records = await this.orm.findMany({
      where: { passengerId, deleted: false },
      orderBy: { createdAt: 'asc' },
      include: { driver: dto.driver },
    });
    const out: PassengerOrder[] = [];
    for (const record of records) {
      const { id, createdAt, from, to, driver, status, cancelReason } = record;
      out.push({ id, createdAt, from, to, driver: driver as Driver, status: status as OrderStatus, cancelReason: cancelReason ?? undefined });
    }  
    return out;
  }

  async listOfDriver(driverId: number): Promise<DriverOrder[]> {
    const records = await this.orm.findMany({
      where: { driverId, deleted: false },
      orderBy: { createdAt: 'asc' },
      include: { passenger: dto.passenger },
    });
    const out: DriverOrder[] = [];
    for (const record of records) {
      const { id, createdAt, passenger, from, to, status, cancelReason } = record;
      out.push({ id, createdAt, passenger: passenger as Passenger, from, to, status: status as OrderStatus, cancelReason: cancelReason ?? undefined });
    }
    return out;
  }

  async listOfActive(): Promise<DriverOrder[]> {
    const records = await this.orm.findMany({
      where: {
        status: OrderStatus.AWAITING_DRIVER,
        deleted: false,
      },
      orderBy: { createdAt: 'asc' },
      include: { passenger: dto.passenger },
    });
    const out: DriverOrder[] = [];
    for (const record of records) {
      const { id, createdAt, passenger, from, to, status, cancelReason } = record;
      out.push({ id, createdAt, passenger: passenger as Passenger, from, to, status: status as OrderStatus, cancelReason: cancelReason ?? undefined });
    }
    return out;
  }

  async listRelatedPassengersByDriver(driverId: number): Promise<Passenger[]> {
    const records = await this.orm.findMany({
      where: { driverId, deleted: false },
      include: { passenger: dto.passenger },
    });
    const map = new Map<number, Passenger>();
    for (const record of records) {
      map.set(record.passenger.id, record.passenger as Passenger);
    }
    return [...map.values()];
  }

  async listRelatedDriversByPassenger(passengerId: number): Promise<Driver[]> {
    const records = await this.orm.findMany({
      where: { passengerId, deleted: false, driverId: { not: null } },
      include: { driver: dto.driver },
    });
    const map = new Map<number, Driver>();
    for (const record of records) {
      if (!record.driver) continue;
      map.set(record.driver.id, record.driver as Driver);
    }
    return [...map.values()];
  }

  async passengerHasActiveOrders(passengerId: number): Promise<boolean> {
    const count = await this.orm.count({
      where: {
        passengerId,
        status: OrderStatus.AWAITING_DRIVER,
        deleted: false,
      },
    });
    return count > 0;
  }

  async passengerHasOrders(passengerId: number): Promise<boolean> {
    const count = await this.orm.count({
      where: {
        passengerId,
        deleted: false,
      },
    });
    return count > 0;
  }

  async list(): Promise<Order[]> {
    const records = await this.orm.findMany({
      where: { deleted: false },
      orderBy: { createdAt: 'asc' },
      include: dto,
    });
    const out: Order[] = [];
    for (const record of records) {
      const { id, createdAt, passenger, from, to, driver, status, cancelReason } = record;
      out.push({ id, createdAt, passenger: passenger as Passenger, from, to, driver: driver as Driver, status: status as OrderStatus, cancelReason: cancelReason ?? undefined });
    }
    return out;
  }

  async findById(id: number): Promise<Order | undefined> {
    const record = await this.orm.findUnique({
      where: { id },
      include: dto,
    });
    if (!record) return;
    const { createdAt, passenger, from, to, driver, status, cancelReason } = record;
    return { id, createdAt, passenger: passenger as Passenger, from, to, driver: driver as Driver, status: status as OrderStatus, cancelReason: cancelReason ?? undefined };
  }

  async update(id: number, input: Partial<PassengerOrder> | Partial<DriverOrder>): Promise<Order> {
    const patch: Partial<OrderRecord> = {
      createdAt: input.createdAt,
      from: input.from,
      to: input.to,
      status: input.status,
      cancelReason: input.cancelReason,
    };
    if ('passenger' in input && input.passenger) {
      patch.passengerId = input.passenger.id;
    }
    if ('driver' in input && input.driver) {
      patch.driverId = input.driver.id;
    }
    if (input.status === OrderStatus.DRIVER_ASSIGNED) {
      patch.assignedAt = new Date().toISOString();
    }
    if (input.status === OrderStatus.COMPLETED) {
      patch.completedAt = new Date().toISOString();
    }
    if (input.status === OrderStatus.CANCELLED) {
      patch.cancelReason = input.cancelReason;
      patch.completedAt = new Date().toISOString();
    }

    const record = await this.orm.update({
      where: { id },
      data: patch,
      include: dto,
    });
    const { createdAt, passenger, from, to, driver, status, cancelReason } = record;
    return { id, createdAt, passenger: passenger as Passenger, from, to, driver: driver as Driver, status: status as OrderStatus, cancelReason: cancelReason ?? undefined };
  }

  async delete(id: number): Promise<Order> {
    const record = await this.orm.update({
      where: { id },
      data: {
        deleted: true,
        deletedAt: new Date().toISOString(),
      },
      include: dto,
    });
    const { createdAt, passenger, from, to, driver, status, cancelReason } = record;
    return { id, createdAt, passenger: passenger as Passenger, from, to, driver: driver as Driver, status: status as OrderStatus, cancelReason: cancelReason ?? undefined };
  }
}
