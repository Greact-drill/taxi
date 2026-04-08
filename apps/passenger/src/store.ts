import { Order, Passenger } from "@packages/shared";
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

  // constructor
  constructor() {
    makeAutoObservable(this);
  }
}

export const store = new Store();

export const useStore = () => store;
