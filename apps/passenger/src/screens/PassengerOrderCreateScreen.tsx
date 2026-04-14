import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { socket } from '../socket';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';

function PassengerOrderCreateScreen() {
  const store = useStore();

  const from = (store.screenFormData?.from ?? '').trim();
  const to = (store.screenFormData?.to ?? '').trim();
  const canSubmit = from.length > 0 && to.length > 0;
  // TODO validation messages

  function onSubmit(): void {
    store.clearError();
    socket.emit('passenger:orders:create', store.screenFormData);
  }

  return (
    <Box
      borderRadius="lg"
      p="4"
      bg="white"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 10px 22px -4px rgba(0, 0, 0, 0.12)"
    >
      <HStack gap="2" align="center">
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
        <Text fontSize="lg" fontWeight="semibold">
          Новый заказ
        </Text>
      </HStack>
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
          Создать
        </Button>
      </VStack>
    </Box>
  );
}

export default observer(PassengerOrderCreateScreen);
