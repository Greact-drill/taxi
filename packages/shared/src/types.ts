export type DispatcherConnectionsItem = { role: string; token?: string };

export type Passenger = {
  id: number;
  name: string;
  phone: string;
  token: string;
};

export type PassengerRegister = {
  name: string;
  phone: string;
};

export type Driver = {
  id: number;
  name: string;
  car: string;
  login: string;
  hash: string;
  token: string;
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

export type Order = {
  id: number;
  /** UTC instant, ISO 8601 with `Z` (e.g. from `Date.prototype.toISOString()`). */
  createdAt: string;
  assignedAt?: string;
  completedAt?: string;

  passenger: Passenger;
  from: string;
  to: string;
  driver?: Driver;
  status: OrderStatus;

};

export type PassengerOrder = Omit<Order, 'passenger'>;
export type DriverOrder = Omit<Order, 'driver'>;
