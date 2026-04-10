import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';
import { socket } from '../socket';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';

function PassengerOrderEditScreen() {
  const store = useStore();

  const from = (store.screenFormData?.from ?? '').trim();
  const to = (store.screenFormData?.to ?? '').trim();
  const canSubmit = from.length > 0 && to.length > 0;
  // TODO validation messages

  function onSubmit(): void {
    store.clearError();
    socket.emit('orders:update', store.screenFormData);
  }

  function onDelete(): void {
    store.clearError();
    socket.emit('orders:delete', store.screenFormData);
  }

  return (
    <Box borderWidth="1px" borderColor="blackAlpha.200" borderRadius="lg" p="4" bg="white">
      <Text fontSize="lg" fontWeight="semibold">
        Заявка #{store.screenFormData.id ?? '-'}
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
        <Button colorPalette="red" variant="outline" onClick={onDelete}>
          Удалить
        </Button>
        <Button variant="ghost" onClick={() => store.openOrdersList()}>
          Назад
        </Button>
      </VStack>
    </Box>
  );
}

export default observer(PassengerOrderEditScreen);
