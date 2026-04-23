import { makeAutoObservable } from 'mobx';
import type { Driver, Passenger, Order } from '@packages/shared';

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

  onlines: Set<string>;
  setOnlines(onlines: Set<string>) {
    this.onlines = onlines;
  }

  screen: 'list' | 'form';
  screenForm: 'create' | 'edit';
  screenFormData: Driver | Passenger | Order | null;
  screenFormDataType: 'driver' | 'passenger' | 'order' | null;

  openCreateDriverForm() {
    this.screen = 'form';
    this.screenForm = 'create';
    this.screenFormDataType = 'driver';
  }

  openEditDriverForm(driver: Driver) {
    this.screen = 'form';
    this.screenForm = 'edit';
    this.screenFormData = driver;
    this.screenFormDataType = 'driver';
  }

  openEditPassengerForm(passenger: Passenger) {
    this.screen = 'form';
    this.screenForm = 'edit';
    this.screenFormData = passenger;
    this.screenFormDataType = 'passenger';
  }

  openEditOrderForm(order: Order) {
    this.screen = 'form';
    this.screenForm = 'edit';
    this.screenFormData = order;
    this.screenFormDataType = 'order';
  }

  openList() {
    this.screen = 'list';
  }

  constructor() {
    this.drivers = [];
    this.passengers = [];
    this.orders = [];
    this.onlines = new Set();
    this.screen = 'list';
    this.screenForm = 'create';
    this.screenFormData = null;
    this.screenFormDataType = null;
    makeAutoObservable(this);
  }
}

export const store = new Store();

export const useStore = () => store;

export const checkOnline = (id: string): boolean => {
  return store.onlines.has(id);
};
