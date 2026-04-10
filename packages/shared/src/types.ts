export type DispatcherConnectionsItem = { role: string; token?: string };

export type Passenger = {
  id: number;
  name: string;
  phone: string;
  token: string;
};

export type Driver = {
  id: number;
  name: string;
  car: string;
  token: string;
};

export type Order = {
  id: number;
  from: string;
  to: string;
  passenger: Passenger;
  driver?: Driver;
};

export type PassengerOrder = Omit<Order, 'passenger'>;
