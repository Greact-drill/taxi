export type Passenger = {
  id: number;
  name: string;
  phone: string;
  token: string;
};

export type Order = {
  id: number;
  from: string;
  to: string;
  passengerId: number;
};

export type ErrorCode = 'UNAUTHORIZED' | 'NOT_FOUND' | 'FORBIDDEN' | 'BAD_REQUEST';

export type Ok<T> = { ok: true; data: T };
export type Fail = { ok: false; error: { code: ErrorCode; message: string } };
export type Result<T> = Ok<T> | Fail;

export type AuthCheckPayload = { token?: string };
export type AuthCheckResponse = Result<{ passenger?: Passenger }>;

export type AuthRegisterPayload = { name: string; phone: string };
export type AuthRegisterResponse = Result<{ token: string; passenger: Passenger }>;

export type MeGetPayload = Record<string, never>;
export type MeGetResponse = Result<{ passenger: Passenger }>;

export type OrdersListPayload = Record<string, never>;
export type OrdersListResponse = Result<{ items: Order[] }>;

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

export type PassengerOrdersPayload = { items: Order[] };
