import { PassengerStore } from '../stores/PassengerStore.js';
import { DriverStore } from '../stores/DriverStore.js';
import { OrderStore } from '../stores/OrderStore.js';
import { PassengerService } from './PassengerService.js';
import { DriverService } from './DriverService.js';
import { OrderService } from './OrderService.js';
import { OrderChatService } from './OrderChatService.js';
import { OrderChatMessageStore } from '../stores/OrderChatMessageStore.js';
import { prisma } from '../prisma.js';

export type Services = {
  passengerService: PassengerService;
  driverService: DriverService;
  orderService: OrderService;
  orderChatService: OrderChatService;
};

export async function createServices(): Promise<Services> {
  await prisma.$connect();

  const passengerStore = new PassengerStore(prisma);
  const driverStore = new DriverStore(prisma);
  const orderStore = new OrderStore(prisma);
  const orderChatMessageStore = new OrderChatMessageStore(prisma);
  const passengerService = new PassengerService(passengerStore);
  const driverService = new DriverService(driverStore);
  const orderChatService = new OrderChatService(orderChatMessageStore);
  const orderService = new OrderService(orderStore, passengerService, driverService);

  /** Тестовые водители для локальной разработки (логин = пароль). */
  await driverService.bootstrap();

  return { passengerService, driverService, orderService, orderChatService };
}