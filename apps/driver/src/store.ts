import type { Driver, DriverOrder, Order, OrderChatMessage } from '@packages/shared';
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

  // driver main UI: list vs form carousel
  screen: 'list' | 'form';
  screenFormData?: DriverOrder;
  screenFormMessages: OrderChatMessage[];

   // screen transition
   isTransitioning: boolean;
   pendingScreen?: 'list' | 'form';

  requestScreen(target: 'list' | 'form') {
    if (this.isTransitioning) {
      this.pendingScreen = target;
      return;
    }

    if (this.screen === target) {
      return;
    }

    this.screen = target;
    this.isTransitioning = true;
  }

  onScreenTransitionEnd() {
    if (!this.isTransitioning) {
      return;
    }

    this.isTransitioning = false;
    if (!this.pendingScreen) {
      return;
    }

    if (this.pendingScreen === this.screen) {
      this.pendingScreen = undefined;
      return;
    }

    this.requestScreen(this.pendingScreen);
    this.pendingScreen = undefined;
  }

  openOrdersList() {
    this.requestScreen('list');
  }

  openOrderForm(order: DriverOrder) {
    this.requestScreen('form');
    this.screenFormData = {...order};
  }

  setScreenFormData(order: DriverOrder) {
    this.screenFormData = {...order};
  }

  setOrderMessages(messages: OrderChatMessage[]) {
    this.screenFormMessages = [...messages];
  }

  constructor() {
    this.screen = 'list';
    this.screenFormMessages = [];

    this.isTransitioning = false;

    makeAutoObservable(this);
  }
}

export const store = new Store();

export const useStore = () => store;
