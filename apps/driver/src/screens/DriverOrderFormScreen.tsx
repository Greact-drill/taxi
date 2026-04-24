import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { ArrowLeft, CircleX } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import {
  formatEvent,
  OrderPassengerRow,
  OrderRouteRow,
  OrderStatusBadge,
} from '@packages/order-ui';
import { OrderStatus } from '@packages/shared';
import { useStore } from '../store';
import { socket } from '../socket';
import DriverOrderChat from '../components/DriverOrderChat';

const TAKEABLE_STATUSES: OrderStatus[] = [
  OrderStatus.ON_TRIP,
  OrderStatus.COMPLETED,
  OrderStatus.CANCELLED,
];

function DriverOrderFormScreen() {
  const store = useStore();
  const order = store.screenFormData;
  const canTake = store.assignedOrders.every((assignedOrder) =>
    TAKEABLE_STATUSES.includes(assignedOrder.status),
  );
    
  const [cancelMode, setCancelMode] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const canCancel = cancelReason.length > 0;

  useEffect(() => {
    setCancelMode(false);
    setCancelReason('');
  }, [order]);

  if (!order) {
    return (
      <Button
        variant="outline"
        onClick={() => store.openOrdersList()}
        w="10"
        h="10"
        minW="10"
        p="0"
        aria-label="Назад"
      >
        <ArrowLeft size={18} aria-hidden />
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

  return (
    <Box
      borderRadius="lg"
      p="4"
      bg="white"
      boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 10px 22px -4px rgba(0, 0, 0, 0.12)'
      overflow="hidden"
      h="100%"
      display="flex"
      flexDirection="column"
      gap="3"
      minH="0"
    >
      <HStack justify="space-between" align="flex-start" gap="3">
        <Button
          variant="outline"
          onClick={() => store.openOrdersList()}
          w="10"
          h="10"
          minW="10"
          p="0"
          aria-label="Назад"
          flexShrink={0}
        >
          <ArrowLeft size={18} aria-hidden />
        </Button>
        <VStack align="start" gap="1.5" flex="1" minW={0}>
          <Text fontWeight="semibold" fontSize="md" color="gray.900" lineHeight="1.2">
            Заказ #{order.id}
          </Text>
          <Text
            as="span"
            fontSize="xs"
            color="gray.500"
            fontWeight="normal"
            lineHeight="1.2"
            mt="-0.5"
            title={new Date(order.createdAt).toLocaleString()}
          >
            {formatEvent(order.createdAt)}
          </Text>
        </VStack>
        <Box flexShrink={0}>
          <OrderStatusBadge status={order.status} />
        </Box>
      </HStack>
      <OrderRouteRow from={order.from} to={order.to} />
      <OrderPassengerRow
        passenger={order.passenger}
        online={false}
      />
      <VStack gap="3" align="stretch" flex="1" minH="0">
        {order.status === OrderStatus.AWAITING_DRIVER && canTake && (
          <Button size="lg" onClick={take}>
            Взять заказ
          </Button>
        )}
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
          {(order.status === OrderStatus.DRIVER_ASSIGNED || 
            order.status === OrderStatus.DRIVER_ARRIVED || 
            order.status === OrderStatus.ON_TRIP) && (
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
          )}
          {(order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED) && (
            <Text fontSize="sm" color="gray.500" >
              Через несколько секунд заказ будет удален из системы автоматически
            </Text>
          )}
        </HStack>
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
        {order.status === OrderStatus.COMPLETED && (
          <Button colorPalette="red" variant="outline" onClick={onDelete} >
            Удалить
          </Button>
        )}
        {order.status !== OrderStatus.AWAITING_DRIVER && <DriverOrderChat />}
      </VStack>
    </Box>
  );
}

export default observer(DriverOrderFormScreen);
