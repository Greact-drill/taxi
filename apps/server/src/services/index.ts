import { PassengerStore } from '../stores/PassengerStore';
import { DriverStore } from '../stores/DriverStore';
import { OrderStore } from '../stores/OrderStore';
import { PassengerService } from '../services/PassengerService';
import { DriverService } from '../services/DriverService';
import { OrderService } from '../services/OrderService';
import { OrderChatService } from '../services/OrderChatService';
import { OrderChatMessageStore } from '../stores/OrderChatMessageStore';
import { prisma } from '../prisma';

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
    const orderService = new OrderService(orderStore, passengerService, driverService, orderChatService);
  
    /** Тестовые водители для локальной разработки (логин = пароль). */
    await driverService.bootstrap();

    return { passengerService, driverService, orderService, orderChatService };
}