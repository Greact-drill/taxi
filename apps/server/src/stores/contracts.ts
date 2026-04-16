import type {
  DriverRecord,
  OrderChatMessageRecord,
  OrderRecord,
  PassengerRecord,
} from '@packages/shared';

export interface PassengerStoreRepository {
  create(data: Omit<PassengerRecord, 'id'>): Promise<PassengerRecord>;
  findByToken(token: string): Promise<PassengerRecord | undefined>;
  getById(id: number): Promise<PassengerRecord | undefined>;
  update(id: number, patch: Partial<PassengerRecord>): Promise<PassengerRecord>;
}

export interface DriverStoreRepository {
  create(data: Omit<DriverRecord, 'id'>): Promise<DriverRecord>;
  findByLogin(login: string): Promise<DriverRecord | undefined>;
  findByToken(token: string): Promise<DriverRecord | undefined>;
  getById(id: number): Promise<DriverRecord | undefined>;
  update(id: number, patch: Partial<DriverRecord>): Promise<DriverRecord>;
}

export interface OrderStoreRepository {
  create(data: Omit<OrderRecord, 'id'>): Promise<OrderRecord>;
  listByPassengerId(passengerId: number): Promise<OrderRecord[]>;
  listByDriverId(driverId: number): Promise<OrderRecord[]>;
  listActive(): Promise<OrderRecord[]>;
  findById(id: number): Promise<OrderRecord | undefined>;
  update(id: number, patch: Partial<OrderRecord>): Promise<OrderRecord>;
  delete(id: number): Promise<OrderRecord>;
}

export interface OrderChatMessageStoreRepository {
  listByOrderId(orderId: number): Promise<OrderChatMessageRecord[]>;
  create(data: Omit<OrderChatMessageRecord, 'id'>): Promise<OrderChatMessageRecord>;
}
