import type { OrderStatus } from './domain.js';
import type { ChatAuthorRole } from './domain.js';

export type PassengerRecord = {
  id: number;
  name: string;
  phone: string;
  token: string;
};

export type DriverRecord = {
  id: number;
  name: string;
  car: string;
  login: string;
  hash: string;
  token: string;
};

export type OrderRecord = {
  id: number;
  passengerId: number;
  from: string;
  to: string;
  driverId?: number;
  status: OrderStatus;
  cancelReason?: string;

  deleted?: boolean;
  /** UTC instant, ISO 8601 with `Z`. */
  createdAt: string;
  assignedAt?: string;
  completedAt?: string;
  deletedAt?: string;
};

export type OrderChatMessageRecord = {
  id: number;
  orderId: number;
  authorRole: ChatAuthorRole;
  text: string;
  createdAt: string;
};
