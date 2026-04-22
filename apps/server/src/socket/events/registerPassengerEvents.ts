import type { Passenger, PassengerOrder, PassengerRegisterInput } from '@packages/shared';
import { OrderStatus } from '@packages/shared';
import type { SocketRuntimeContext } from '../SocketRuntime.js';
import { CANCELLED_CLEAN_TIMEOUT } from '../SocketRuntime.js';

export function registerPassengerEvents(ctx: SocketRuntimeContext): void {
  // auth events (passenger*)
  ctx.on('passenger:auth:register', async (userData: PassengerRegisterInput) => {
    const token = await ctx.passengerService.register(userData);
    ctx.socket.emit('auth:token', token);
  });

  ctx.on('passenger:auth:login', async () => {
    throw Error('Авторизация пока не доступна для пассажира');
  });

  ctx.on('passenger:auth:request', async () => {
    const passenger = ctx.socket.data.passenger as Passenger | undefined;
    ctx.socket.emit('auth:profile', passenger);
  });

  ctx.on('passenger:profile:update', async (profile: Partial<Passenger>) => {
    const passenger = ctx.requirePassenger();
    const result = await ctx.passengerService.update(passenger.id, profile);
    ctx.send(`passenger:${passenger.id}`, 'passenger:profile', result);
  });

  ctx.on('passenger:orders:request', async () => {
    const passenger = ctx.requirePassenger();
    ctx.send(
      `passenger:${passenger.id}`,
      'passenger:orders',
      await ctx.orderService.listOfPassenger(passenger.id),
    );
  });

  ctx.on('passenger:orders:create', async (input: Partial<PassengerOrder>) => {
    const passenger = ctx.requirePassenger();
    await ctx.orderService.create(input, passenger);

    ctx.send(
      `passenger:${passenger.id}`,
      'passenger:orders',
      await ctx.orderService.listOfPassenger(passenger.id),
    );
    ctx.send(
      'driver',
      'driver:orders:active',
      await ctx.orderService.listOfActive(),
    );
  });

  ctx.on('passenger:orders:update', async (input: Partial<PassengerOrder>) => {
    const passenger = ctx.requirePassenger();
    if (!input.id) throw Error('Номер заказа должен быть указан');

    const result = await ctx.orderService.update(input.id, { ...input });

    ctx.send(
      `passenger:${passenger.id}`,
      'passenger:orders',
      await ctx.orderService.listOfPassenger(passenger.id),
    );

    if (result.driver) {
      const driver = result.driver;
      ctx.send(
        `driver:${driver.id}`,
        'driver:orders',
        await ctx.orderService.listOfDriver(driver.id),
      );
    } else {
      ctx.send(
        'driver',
        'driver:orders:active',
        await ctx.orderService.listOfActive(),
      );
    }
  });

  ctx.on('passenger:orders:cancel', async (input: PassengerOrder, reason: string) => {
    const passenger = ctx.requirePassenger();

    const order = await ctx.orderService.update(input.id, {
      status: OrderStatus.CANCELLED,
      cancelReason: reason,
    });

    ctx.send(
      `passenger:${passenger.id}`,
      'passenger:orders',
      await ctx.orderService.listOfPassenger(passenger.id),
    );

    if (order.driver) {
      ctx.send(
        `driver:${order.driver.id}`,
        'driver:orders',
        await ctx.orderService.listOfDriver(order.driver.id),
      );
    }

    if (input.status === OrderStatus.AWAITING_DRIVER) {
      ctx.send(
        'driver',
        'driver:orders:active',
        await ctx.orderService.listOfActive(),
      );
    }

    ctx.deleteAfterTimeout(order, CANCELLED_CLEAN_TIMEOUT);
  });

  ctx.on('passenger:orders:delete', async (order: PassengerOrder) => {
    const passenger = ctx.requirePassenger();

    ctx.send(
      `passenger:${passenger.id}`,
      'passenger:orders',
      await ctx.orderService.listOfPassenger(passenger.id),
    );

    if (order.driver) {
      ctx.send(
        `driver:${order.driver.id}`,
        'driver:orders',
        await ctx.orderService.listOfDriver(order.driver.id),
      );
    }

    ctx.send(
      'driver',
      'driver:orders:active',
      await ctx.orderService.listOfActive(),
    );
  });

  ctx.on('passenger:order:messages:request', async (passengerOrder: PassengerOrder) => {
    const passenger = ctx.requirePassenger();
    const messages = await ctx.orderChatService.messages(passengerOrder);
    ctx.send(
      `passenger:${passenger.id}`,
      'passenger:order:messages',
      passengerOrder.id,
      messages,
    );
  });

  ctx.on('passenger:order:messages:send', async (passengerOrder: PassengerOrder, text: string) => {
    const passenger = ctx.requirePassenger();
    await ctx.orderChatService.sendMessage(passengerOrder, { text, authorRole: 'passenger' });
    const messages = await ctx.orderChatService.messages(passengerOrder);

    ctx.send(
      `passenger:${passenger.id}`,
      'passenger:order:messages',
      passengerOrder.id,
      messages,
    );
    if (passengerOrder.driver) {
      ctx.send(
        `driver:${passengerOrder.driver.id}`,
        'passenger:order:messages',
        passengerOrder.id,
        messages,
      );
    }
  });
}

