import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { ArrowLeft, CircleX } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { useStore } from '../store';
import { OrderStatus } from '@packages/shared';
import { formatEvent, OrderStatusBadge } from '@packages/order-ui';

import PassengerOrderChat from '../components/PassengerOrderChat';

function PassengerOrderEditScreen() {
  const store = useStore();
  const order = store.screenFormData;
  const [cancelMode, setCancelMode] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const from = (store.screenFormData?.from ?? '').trim();
  const to = (store.screenFormData?.to ?? '').trim();
  const status = store.screenFormData?.status;
  const createdAt = store.screenFormData?.createdAt;
  const canSubmit = from.length > 0 && to.length > 0;
  const canCancel = cancelReason.length > 0;
  // TODO validation messages

  const driver = store.screenFormData?.driver;

  useEffect(() => {
    setCancelMode(false);
    setCancelReason('');
  }, [order]);

  function onSubmit(): void {
    store.clearError();
    socket.emit('passenger:orders:update', store.screenFormData);
  }

  function onCancel(): void {
    store.clearError();
    socket.emit('passenger:orders:cancel', order, cancelReason);
  }

  function onDelete(): void {
    store.clearError();
    socket.emit('passenger:orders:delete', store.screenFormData);
  }

  return (
    <Box
      borderRadius="lg"
      p="4"
      bg="white"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 10px 22px -4px rgba(0, 0, 0, 0.12)"
      h="100%"
      display="flex"
      flexDirection="column"
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
            Заказ #{store.screenFormData.id}
          </Text>
          {createdAt && (
            <Text
              as="span"
              fontSize="xs"
              color="gray.500"
              fontWeight="normal"
              lineHeight="1.2"
              mt="-0.5"
              title={new Date(createdAt).toLocaleString()}
            >
              {formatEvent(createdAt)}
            </Text>
          )}
        </VStack>
        {status && (
          <Box flexShrink={0}>
            <OrderStatusBadge status={status} />
          </Box>
        )}
      </HStack>
      <VStack gap="3" align="stretch" mt="3" flex="1" minH="0">
        <Input
          placeholder="Откуда"
          value={order.from ?? ''}
          onChange={(e) => {
            store.setScreenFormData({ ...order, from: e.target.value });
          }}
        />
        <Input
          placeholder="Куда"
          value={order.to ?? ''}
          onChange={(e) => {
            store.setScreenFormData({ ...order, to: e.target.value });
          }}
        />
        <Button size="lg" onClick={onSubmit} disabled={!canSubmit}>
          Сохранить изменения
        </Button>
        {!cancelMode && (order.status === OrderStatus.AWAITING_DRIVER ||
          order.status === OrderStatus.DRIVER_ASSIGNED ||
          order.status === OrderStatus.DRIVER_ARRIVED) && (
          <Button
            colorPalette="red" variant="outline"
            onClick={() => setCancelMode(true)}
          >
            Отменить заказ
          </Button>
        )}
        {cancelMode && (
          <VStack gap="3" align="stretch">
            <Input
              placeholder="Что случилось?"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <Button size="lg" colorPalette="red" onClick={onCancel} disabled={!canCancel}>
              Отменить заказ
            </Button>
            <Button variant="outline" onClick={() => setCancelMode(false)}>
              Не отменять заказ
            </Button>
          </VStack>
        )}
        {status === OrderStatus.COMPLETED && (
          <Button colorPalette="red" variant="outline" onClick={onDelete}>
            Удалить
          </Button>
        )}    
        {driver && <PassengerOrderChat />}
      </VStack>
    </Box>
  );
}

export default observer(PassengerOrderEditScreen);
