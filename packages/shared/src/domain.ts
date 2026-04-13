export type DispatcherConnectionsItem = { role: string; token?: string };

export type Passenger = {
  id: number;
  name: string;
  phone: string;
};

export type PassengerRegister = {
  name: string;
  phone: string;
};

export type Driver = {
  id: number;
  name: string;
  car: string;
};

export type DriverLogin = {
  login: string;
  password: string;
};

export enum OrderStatus {
  AWAITING_DRIVER = 'awaiting_driver',
  DRIVER_ASSIGNED = 'driver_assigned',
  DRIVER_ARRIVED = 'driver_arrived',
  ON_TRIP = 'on_trip',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export const DELETABLE_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.COMPLETED,
  OrderStatus.CANCELLED,
];

export type ChatAuthorRole = 'passenger' | 'driver' | 'dispatcher';

/** Сообщение чата заказа; связь с заказом только через `Order.messages`. Идентификатор заказа — в `OrderChatMessageRecord.orderId` (stores). */
export type OrderChatMessage = {
  id: number;
  authorRole: ChatAuthorRole;
  text: string;
  createdAt: string;
};

export type Order = {
  id: number;
  createdAt: string;
  passenger: Passenger;
  from: string;
  to: string;
  driver?: Driver;
  status: OrderStatus;
  cancelReason?: string;
};

export type PassengerOrder = Omit<Order, 'passenger'>;
export type DriverOrder = Omit<Order, 'driver'>;
