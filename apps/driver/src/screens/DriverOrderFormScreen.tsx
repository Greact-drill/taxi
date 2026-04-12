import { Box, Button, HStack, Input, VStack } from '@chakra-ui/react';
import { CircleX } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import {
  OrderCardHeader,
  OrderPassengerRow,
  OrderRouteRow,
} from '@packages/order-ui';
import { DELETABLE_ORDER_STATUSES, OrderStatus } from '@packages/shared';
import { useStore } from '../store';
import { socket } from '../socket';

function DriverOrderFormScreen() {
  const store = useStore();
  const order = store.screenFormData;
  const hasAssigned = store.assignedOrders.length;
  const [cancelMode, setCancelMode] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const canCancel = cancelReason.length > 0;

  useEffect(() => {
    setCancelMode(false);
    setCancelReason('');
  }, [order]);

  if (!order) {
    return (
      <Button variant="outline" onClick={() => store.openOrdersList()}>
        Назад
      </Button>
    );
  }

  function take(): void {
    store.clearError();
    socket.emit('driver:orders:take', order);
  }

  function next(nextStatus: OrderStatus): void {
    store.clearError();
    socket.emit('driver:orders:next', order, nextStatus);
  }

  function cancel(): void {
    store.clearError();
    socket.emit('driver:orders:cancel', order, cancelReason);
  }

  function onDelete(): void {
    store.clearError();
    socket.emit('driver:orders:delete', order);
  }

  const showProgressRow =
    !cancelMode &&
    (order.status === OrderStatus.DRIVER_ASSIGNED ||
      order.status === OrderStatus.DRIVER_ARRIVED ||
      order.status === OrderStatus.ON_TRIP);

  return (
    <Box
      borderRadius="lg"
      p="4"
      bg="white"
      boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 10px 22px -4px rgba(0, 0, 0, 0.12)'
      overflow="hidden"
    >
      <OrderCardHeader orderId={order.id} status={order.status} placementAt={order.createdAt} />
      <OrderRouteRow from={order.from} to={order.to} />
      <OrderPassengerRow
        name={order.passenger.name}
        phone={order.passenger.phone}
        attachToCardBottom={false}
      />
      <VStack gap="3" align="stretch" mt="4">
        {order.status === OrderStatus.AWAITING_DRIVER && hasAssigned < 2 && (
          <Button size="lg" onClick={take}>
            Взять заказ
          </Button>
        )}
        {showProgressRow && (
          <HStack gap="2" align="stretch">
            {order.status === OrderStatus.DRIVER_ASSIGNED && (
              <Button size="lg" flex="1" onClick={() => next(OrderStatus.DRIVER_ARRIVED)}>
                На месте
              </Button>
            )}
            {order.status === OrderStatus.DRIVER_ARRIVED && (
              <Button size="lg" flex="1" onClick={() => next(OrderStatus.ON_TRIP)}>
                Поехали!
              </Button>
            )}
            {order.status === OrderStatus.ON_TRIP && (
              <Button size="lg" flex="1" onClick={() => next(OrderStatus.COMPLETED)}>
                Приехали
              </Button>
            )}
            <Button
              variant="ghost"
              size="lg"
              px="2"
              colorPalette="red"
              onClick={() => setCancelMode(true)}
              aria-label="Отменить заказ"
            >
              <CircleX size={22} strokeWidth={2} aria-hidden />
            </Button>
          </HStack>
        )}
        {cancelMode && (
          <VStack gap="3" align="stretch">
            <Input
              placeholder="Что случилось?"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <Button size="lg" colorPalette="red" onClick={cancel} disabled={!canCancel}>
              Отменить заказ
            </Button>
            <Button variant="outline" onClick={() => setCancelMode(false)}>
              Не отменять заказ
            </Button>
          </VStack>
        )}
        {order.status && DELETABLE_ORDER_STATUSES.includes(order.status) && (
          <Button colorPalette="red" variant="outline" onClick={onDelete} >
            Удалить
          </Button>
        )}
        <Button variant="outline" onClick={() => store.openOrdersList()}>
          Назад
        </Button>
      </VStack>
    </Box>
  );
}

export default observer(DriverOrderFormScreen);
