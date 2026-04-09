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

export type ErrorCode = 'UNAUTHORIZED' | 'NOT_FOUND' | 'FORBIDDEN' | 'BAD_REQUEST';

export type Ok<T> = { ok: true; data: T };
export type Fail = { ok: false; error: { code: ErrorCode; message: string } };
export type Result<T> = Ok<T> | Fail;

export type AuthRegisterPayload = Partial<Passenger>;
export type AuthRegisterResponse = { token: string; };

export type MeGetPayload = undefined;
export type MeGetResponse = { passenger: Passenger };

export type PassengerOrdersListPayload = undefined;
export type PassengerOrdersListResponse = { items: PassengerOrder[] };

export type OrdersGetPayload = { id: number };
export type OrdersGetResponse = Result<{ item: Order }>;

export type OrdersCreatePayload = { from: string; to: string };
export type OrdersCreateResponse = Result<{ item: Order }>;

export type OrdersUpdatePayload = { id: number; from: string; to: string };
export type OrdersUpdateResponse = Result<{ item: Order }>;

export type OrdersDeletePayload = { id: number };
export type OrdersDeleteResponse = Result<{}>;

export type DispatcherConnectionsItem = { role: string; token?: string };
export type DispatcherConnectionsPayload = { items: DispatcherConnectionsItem[] };

export type DriverOrderCreatedPayload = { item: Order };
export type DriverOrderUpdatedPayload = { item: Order };

export type PassengerOrdersPayload = PassengerOrder[];
