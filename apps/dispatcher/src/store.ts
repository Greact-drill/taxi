import { makeAutoObservable } from 'mobx';
import type { Driver, Passenger, Order, StatusMap } from '@packages/shared';

const TOKEN_STORAGE_KEY = 'taxi_dispatcher_token';

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

  drivers: Driver[];
  setDrivers(drivers: Driver[]) {
    this.drivers = drivers;
  }

  passengers: Passenger[];
  setPassengers(passengers: Passenger[]) {
    this.passengers = passengers;
  }

  orders: Order[];
  setOrders(orders: Order[]) {
    this.orders = orders;
  }

  statusMap: StatusMap;
  setStatusMap(statusMap: StatusMap) {
    this.statusMap = statusMap;
  }
  changeStatusMap(id: string, status: 'online' | 'offline' | 'checking') {
    this.statusMap = { ...this.statusMap, [id]: status };
  }

  constructor() {
    this.drivers = [];
    this.passengers = [];
    this.orders = [];
    this.statusMap = {};
    makeAutoObservable(this);
  }
}

export const store = new Store();

export const useStore = () => store;

export const checkOnline = (id: string): boolean => {
  return store.statusMap[id] === 'online';
}
