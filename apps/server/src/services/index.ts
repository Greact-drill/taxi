import { PassengerService } from './PassengerService.js';
import { DriverService } from './DriverService.js';
import { OrderService } from './OrderService.js';
import { OrderChatService } from './OrderChatService.js';
import { prisma } from '../prisma.js';

export type Services = {
  passengerService: PassengerService;
  driverService: DriverService;
  orderService: OrderService;
  orderChatService: OrderChatService;
};

export async function createServices(): Promise<Services> {
  await prisma.$connect();

  const passengerService = new PassengerService(prisma.passengerRecord);
  const driverService = new DriverService(prisma.driverRecord);
  const orderService = new OrderService(prisma.orderRecord);
  const orderChatService = new OrderChatService(prisma.orderChatMessageRecord);

  /** Тестовые водители для локальной разработки (логин = пароль). */
  await driverService.bootstrap();

  return { passengerService, driverService, orderService, orderChatService };
}