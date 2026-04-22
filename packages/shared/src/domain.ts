export type DispatcherConnectionsItem = { role: string; token?: string };

export type Status = 'online' | 'offline' | 'checking';

export type StatusMap = {
  [id: string]: Status;
}

export type Passenger = {
  id: number;
  name: string;
  phone: string;
};

export type PassengerRegisterInput = {
  name: string;
  phone: string;
};

export type Driver = {
  id: number;
  name: string;
  car: string;
  login: string;
};

export type DriverCreateInput = {
  name: string;
  car: string;
  login: string;
  password: string;
};

export type DriverLoginInput = {
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

export type Order = {
  id: number;
  createdAt: string;
  passenger: Passenger;
  from: string;
  to: string;
  driver?: Driver;
  status: OrderStatus;
  cancelReason?: string;

  assignedAt?: string;
  completedAt?: string;
  deletedAt?: string;
};

export type OrderCreateInput = {
  from: string;
  to: string;
};

export enum ChatAuthorRole {
  PASSENGER = 'passenger',
  DRIVER = 'driver',
  DISPATCHER = 'dispatcher',
}

export type OrderChatMessage = {
  id: number;
  authorRole: ChatAuthorRole;
  text: string;
  createdAt: string;
};

export type PassengerOrder = Omit<Order, 'passenger'>;
export type DriverOrder = Omit<Order, 'driver'>;
