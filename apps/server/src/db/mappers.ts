import {
  ChatAuthorRole as PrismaChatAuthorRole,
  OrderStatus as PrismaOrderStatus,
  type Driver as PrismaDriver,
  type Order as PrismaOrder,
  type OrderChatMessage as PrismaOrderChatMessage,
  type Passenger as PrismaPassenger,
} from '../generated/prisma/client.js';
import {
  OrderStatus,
  type ChatAuthorRole,
  type DriverRecord,
  type OrderChatMessageRecord,
  type OrderRecord,
  type PassengerRecord,
} from '@packages/shared';

function toIsoString(value: Date | string | null): string | undefined {
  if (value === null) return undefined;
  if (value instanceof Date) return value.toISOString();

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
}

export function toPrismaOrderStatus(status: OrderStatus): PrismaOrderStatus {
  switch (status) {
    case OrderStatus.AWAITING_DRIVER:
      return PrismaOrderStatus.AWAITING_DRIVER;
    case OrderStatus.DRIVER_ASSIGNED:
      return PrismaOrderStatus.DRIVER_ASSIGNED;
    case OrderStatus.DRIVER_ARRIVED:
      return PrismaOrderStatus.DRIVER_ARRIVED;
    case OrderStatus.ON_TRIP:
      return PrismaOrderStatus.ON_TRIP;
    case OrderStatus.COMPLETED:
      return PrismaOrderStatus.COMPLETED;
    case OrderStatus.CANCELLED:
      return PrismaOrderStatus.CANCELLED;
  }
}

export function fromPrismaOrderStatus(status: PrismaOrderStatus): OrderStatus {
  switch (status) {
    case PrismaOrderStatus.AWAITING_DRIVER:
      return OrderStatus.AWAITING_DRIVER;
    case PrismaOrderStatus.DRIVER_ASSIGNED:
      return OrderStatus.DRIVER_ASSIGNED;
    case PrismaOrderStatus.DRIVER_ARRIVED:
      return OrderStatus.DRIVER_ARRIVED;
    case PrismaOrderStatus.ON_TRIP:
      return OrderStatus.ON_TRIP;
    case PrismaOrderStatus.COMPLETED:
      return OrderStatus.COMPLETED;
    case PrismaOrderStatus.CANCELLED:
      return OrderStatus.CANCELLED;
  }
}

export function toPrismaChatAuthorRole(role: ChatAuthorRole): PrismaChatAuthorRole {
  switch (role) {
    case 'passenger':
      return PrismaChatAuthorRole.PASSENGER;
    case 'driver':
      return PrismaChatAuthorRole.DRIVER;
    case 'dispatcher':
      return PrismaChatAuthorRole.DISPATCHER;
  }
}

export function fromPrismaChatAuthorRole(role: PrismaChatAuthorRole): ChatAuthorRole {
  switch (role) {
    case PrismaChatAuthorRole.PASSENGER:
      return 'passenger';
    case PrismaChatAuthorRole.DRIVER:
      return 'driver';
    case PrismaChatAuthorRole.DISPATCHER:
      return 'dispatcher';
  }
}

export function mapPassengerRow(row: PrismaPassenger): PassengerRecord {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    token: row.token,
  };
}

export function mapDriverRow(row: PrismaDriver): DriverRecord {
  return {
    id: row.id,
    name: row.name,
    car: row.car,
    login: row.login,
    hash: row.hash,
    token: row.token,
  };
}

export function mapOrderRow(row: PrismaOrder): OrderRecord {
  return {
    id: row.id,
    passengerId: row.passengerId,
    from: row.from,
    to: row.to,
    driverId: row.driverId ?? undefined,
    status: fromPrismaOrderStatus(row.status),
    cancelReason: row.cancelReason ?? undefined,
    deleted: row.deleted,
    createdAt: toIsoString(row.createdAt)!,
    assignedAt: toIsoString(row.assignedAt),
    completedAt: toIsoString(row.completedAt),
    deletedAt: toIsoString(row.deletedAt),
  };
}

export function mapOrderChatMessageRow(row: PrismaOrderChatMessage): OrderChatMessageRecord {
  return {
    id: row.id,
    orderId: row.orderId,
    authorRole: fromPrismaChatAuthorRole(row.authorRole),
    text: row.text,
    createdAt: toIsoString(row.createdAt)!,
  };
}
