import { OrderChatMessage, PassengerOrder, Passenger } from "@packages/shared";
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
    this.orders = [...orders];
  }

  // passenger main UI: list vs form carousel
  screen: 'list' | 'form';
  screenForm: 'new' | 'edit';
  screenFormData: Partial<PassengerOrder>;
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
  
  // screen navigation
  openOrdersList() {
    this.requestScreen('list');
  }

  openCreateOrderForm() {
    this.requestScreen('form');
    this.screenForm = 'new';
    this.screenFormData = {};
  }

  openEditOrderForm(order: PassengerOrder) {
    this.requestScreen('form');
    this.screenForm = 'edit';
    this.screenFormData = { ...order };
  }

  setScreenFormData(order: Partial<PassengerOrder>) {
    this.screenFormData = {...order};
  }

  setOrderMessages(messages: OrderChatMessage[]) {
    this.screenFormMessages = [...messages];
  }

  // constructor
  constructor() {
    this.screen = 'list';
    this.screenForm = 'new';
    this.screenFormData = {};
    this.screenFormMessages = [];

    this.isTransitioning = false;

    makeAutoObservable(this);
  }
}

export const store = new Store();

export const useStore = () => store;
