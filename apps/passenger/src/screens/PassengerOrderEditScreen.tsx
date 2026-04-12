import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';
import { socket } from '../socket';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';
import { DELETABLE_ORDER_STATUSES, OrderStatus } from '@packages/shared';

const deletable = [OrderStatus.AWAITING_DRIVER, ...DELETABLE_ORDER_STATUSES];

function PassengerOrderEditScreen() {
  const store = useStore();

  const from = (store.screenFormData?.from ?? '').trim();
  const to = (store.screenFormData?.to ?? '').trim();
  const status = store.screenFormData?.status;
  const canSubmit = from.length > 0 && to.length > 0;
  // TODO validation messages

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
    >
      <Text fontSize="lg" fontWeight="semibold">
        Заказ #{store.screenFormData.id ?? '-'}
      </Text>
      <VStack gap="3" align="stretch" mt="3">
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
        <Button variant="outline" onClick={() => store.openOrdersList()}>
          Назад
        </Button>
      </VStack>
    </Box>
  );
}

export default observer(PassengerOrderEditScreen);
