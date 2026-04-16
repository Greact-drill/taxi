import type { Driver, DriverLogin, DriverOrder } from '@packages/shared';
import { OrderStatus } from '@packages/shared';
import type { SocketRuntimeContext } from '../SocketRuntime';
import { CANCELLED_CLEAN_TIMEOUT, COMPLETED_CLEAN_TIMEOUT } from '../SocketRuntime';

export function registerDriverEvents(ctx: SocketRuntimeContext): void {
  
  // driver auth events
  ctx.on('driver:auth:register', async () => {
    throw Error('Самостоятельная регистрация не доступна для водителя');
  });

  ctx.on('driver:auth:login', async (credentials: DriverLogin) => {
    const token = await ctx.driverService.login(credentials);
    ctx.socket.emit('auth:token', token);
  });

  ctx.on('driver:auth:request', async () => {
    const driver = ctx.socket.data.driver as Driver | undefined;
    ctx.socket.emit('auth:profile', driver);
  });

  ctx.on('driver:profile:update', async (profile: Partial<Driver>) => {
    const driver = ctx.requireDriver();
    const result = await ctx.driverService.update(driver.id, profile);
    ctx.send(`driver:${driver.id}`, 'driver:profile', result);
  });

  // driver orders events
  ctx.on('driver:orders:active:request', async () => {
    const driver = ctx.requireDriver();
    ctx.send(
      `driver:${driver.id}`,
      'driver:orders:active',
      await ctx.orderService.listOfActive(),
    );
  });

  ctx.on('driver:orders:request', async () => {
    const driver = ctx.requireDriver();
    ctx.send(
      `driver:${driver.id}`,
      'driver:orders',
      await ctx.orderService.listOfDriver(driver.id),
    );
  });

  ctx.on('driver:orders:take', async (order: DriverOrder) => {
    const driver = ctx.requireDriver();
    await ctx.orderService.update(order.id, { driver, status: OrderStatus.DRIVER_ASSIGNED });

    ctx.send(
      `passenger:${order.passenger.id}`,
      'passenger:orders',
      await ctx.orderService.listOfPassenger(order.passenger.id),
    );
    ctx.send(
      `driver:${driver.id}`,
      'driver:orders',
      await ctx.orderService.listOfDriver(driver.id),
    );
    ctx.send(
      'driver',
      'driver:orders:active',
      await ctx.orderService.listOfActive(),
    );
  });

  ctx.on('driver:orders:next', async (order: DriverOrder, status: OrderStatus) => {
    const driver = ctx.requireDriver();
    await ctx.orderService.update(order.id, { status });

    ctx.send(
      `passenger:${order.passenger.id}`,
      'passenger:orders',
      await ctx.orderService.listOfPassenger(order.passenger.id),
    );
    ctx.send(
      `driver:${driver.id}`,
      'driver:orders',
      await ctx.orderService.listOfDriver(driver.id),
    );

    if (status === OrderStatus.COMPLETED) {
      ctx.deleteAfterTimeout(order, COMPLETED_CLEAN_TIMEOUT);
    }
  });

  ctx.on('driver:orders:cancel', async (order: DriverOrder, reason: string) => {
    const driver = ctx.requireDriver();
    await ctx.orderService.update(order.id, {
      status: OrderStatus.CANCELLED,
      cancelReason: reason,
    });

    ctx.send(
      `passenger:${order.passenger.id}`,
      'passenger:orders',
      await ctx.orderService.listOfPassenger(order.passenger.id),
    );
    ctx.send(
      `driver:${driver.id}`,
      'driver:orders',
      await ctx.orderService.listOfDriver(driver.id),
    );

    ctx.deleteAfterTimeout(order, CANCELLED_CLEAN_TIMEOUT);
  });

  ctx.on('driver:orders:delete', async (order: DriverOrder) => {
    const driver = ctx.requireDriver();
    await ctx.orderService.delete(order.id);

    ctx.send(
      `passenger:${order.passenger.id}`,
      'passenger:orders',
      await ctx.orderService.listOfPassenger(order.passenger.id),
    );
    ctx.send(
      `driver:${driver.id}`,
      'driver:orders',
      await ctx.orderService.listOfDriver(driver.id),
    );
  });

  ctx.on('driver:order:messages:request', async (driverOrder: DriverOrder) => {
    const driver = ctx.requireDriver();
    const messages = await ctx.orderChatService.messages(driverOrder);
    ctx.send(
      `driver:${driver.id}`,
      'driver:order:messages',
      driverOrder.id,
      messages,
    );
  });

  ctx.on('driver:order:messages:send', async (driverOrder: DriverOrder, text: string) => {
    const driver = ctx.requireDriver();
    await ctx.orderChatService.sendMessage(driverOrder, { text, authorRole: 'driver' });
    const messages = await ctx.orderChatService.messages(driverOrder);

    ctx.send(
      `driver:${driver.id}`,
      'driver:order:messages',
      driverOrder.id,
      messages,
    );
    ctx.send(
      `passenger:${driverOrder.passenger.id}`,
      'driver:order:messages',
      driverOrder.id,
      messages,
    );
  });
}

