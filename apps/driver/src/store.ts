import type { Driver, DriverOrder, Order } from '@packages/shared';
import { makeAutoObservable } from 'mobx';

const TOKEN_STORAGE_KEY = 'taxi_driver_token';

export function orderToDriverOrder(order: Order): DriverOrder {
  const { driver: _omit, ...rest } = order;
  return rest;
}

class Store {
  online: boolean = false;

  setOnline(online: boolean) {
    this.online = online;
  }

  error?: string;

  setError(error: string) {
    this.error = error;
  }

  clearError() {
    this.error = undefined;
  }

  token: string | null = localStorage.getItem(TOKEN_STORAGE_KEY);

  setToken(token: string) {
    this.token = token;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  currentUser?: Driver;

  setCurrentUser(user: Driver) {
    this.currentUser = user;
  }

  clearCurrentUser() {
    this.currentUser = undefined;
  }

  activeOrders: DriverOrder[] = [];

  setActiveOrders(orders: DriverOrder[]) {
    this.activeOrders = [...orders];
  }

  assignedOrders: DriverOrder[] = [];

  setAssignedOrders(orders: DriverOrder[]) {
    this.assignedOrders = [...orders];
  }

  screen: 'list' | 'form';
  screenFormData?: DriverOrder;

  openOrdersList() {
    this.screen = 'list';
  }

  openOrderForm(order: DriverOrder) {
    this.screenFormData = order;
    this.screen = 'form';
  }

  constructor() {
    this.screen = 'list';
    makeAutoObservable(this);
  }
}

export const store = new Store();

export const useStore = () => store;
