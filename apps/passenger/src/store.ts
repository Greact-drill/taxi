import { PassengerOrder, Passenger } from "@packages/shared";
import { makeAutoObservable } from "mobx";

const TOKEN_STORAGE_KEY = 'taxi_token';

class Store {
  // online/offline status
  online: boolean = false;

  setOnline(online: boolean) {
    this.online = online;
  }

  // error handling
  error?: string;

  setError(error: string) {
    this.error = error;
  }

  clearError() {
    this.error = undefined;
  }

  // current user
  token: string | null = localStorage.getItem(TOKEN_STORAGE_KEY);

  setToken(token: string) {
    this.token = token;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  currentUser?: Passenger;

  setCurrentUser(user: Passenger) {
    this.currentUser = user;
  }

  clearCurrentUser() {
    this.currentUser = undefined;
  }

  // orders
  orders: PassengerOrder[] = [];

  setOrders(orders: PassengerOrder[]) {
    this.orders = orders;
  }

  // passenger main UI: list vs form carousel
  screen: 'list' | 'form';
  screenForm: 'new' | 'edit';
  screenFormData: Partial<PassengerOrder>;

  openOrdersList() {
    this.screen = 'list';
  }

  openCreateOrderForm() {
    this.screen = 'form';
    this.screenForm = 'new';
    this.screenFormData = {};    
  }

  openEditOrderForm(order: PassengerOrder) {
    this.screen = 'form';
    this.screenForm = 'edit';
    this.screenFormData = { ...order };    
  }

  setScreenFormData(updater: (prev: Partial<PassengerOrder>) => Partial<PassengerOrder>) {
    this.screenFormData = updater(this.screenFormData);
  }

  // constructor
  constructor() {
    this.screen = 'list';
    this.screenForm = 'new';
    this.screenFormData = {};
    makeAutoObservable(this);
  }
}

export const store = new Store();

export const useStore = () => store;
