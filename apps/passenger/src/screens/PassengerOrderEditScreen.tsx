import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { socket } from '../socket';
import { useStore } from '../store';
import { DELETABLE_ORDER_STATUSES, OrderStatus } from '@packages/shared';
import { formatEvent, OrderStatusBadge } from '@packages/order-ui';

import PassengerOrderChat from '../components/PassengerOrderChat';

const deletable = [OrderStatus.AWAITING_DRIVER, ...DELETABLE_ORDER_STATUSES];

function PassengerOrderEditScreen() {
  const store = useStore();

  const from = (store.screenFormData?.from ?? '').trim();
  const to = (store.screenFormData?.to ?? '').trim();
  const status = store.screenFormData?.status;
  const createdAt = store.screenFormData?.createdAt;
  const canSubmit = from.length > 0 && to.length > 0;
  // TODO validation messages
  const driver = store.screenFormData?.driver;

  function onSubmit(): void {
    store.clearError();
    socket.emit('passenger:orders:update', store.screenFormData);
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
          value={store.screenFormData.from ?? ''}
          onChange={(e) => {
            store.setScreenFormData((prev) => ({ ...prev, from: e.target.value }));
          }}
        />
        <Input
          placeholder="Куда"
          value={store.screenFormData.to ?? ''}
          onChange={(e) => {
            store.setScreenFormData((prev) => ({ ...prev, to: e.target.value }));
          }}
        />
        <Button size="lg" onClick={onSubmit} disabled={!canSubmit}>
          Сохранить
        </Button>
        {status && deletable.includes(status) && (
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
