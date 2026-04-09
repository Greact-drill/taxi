import { useEffect } from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import type { PassengerOrder } from '@packages/shared';
import { api } from '../api';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { socket } from '../socket';

function PassengerOrdersListScreen(props: {
  onCreate: () => void;
  onOpenOrder: (order: PassengerOrder) => void;
}) {
  const store = useStore();

  // useEffect(() => {
  //   void (async () => {
  //     const response = await api.orders();
  //     if (response.ok) store.setOrders(response.data.items);
  //     else store.setError(response.error.message);
  //   })();
  // }, [store]);
  useEffect(() => {
    socket.emit('orders:request')
  }, []);
  // ^^^ это перенесено просто в emit 'orders:request'
  // TODO убрать api

  return (
    <>
      <Text fontSize="lg" fontWeight="semibold">
        Мои заявки
      </Text>

      <Button
        size="lg"
        variant="outline"
        borderStyle="dashed"
        borderWidth="2px"
        py="10"
        onClick={props.onCreate}
      >
        Создать
      </Button>

      <VStack gap="3" align="stretch">
        {store.orders.map((o) => (
          <Box
            key={o.id}
            borderWidth="1px"
            borderColor="blackAlpha.200"
            borderRadius="lg"
            p="4"
            bg="white"
            cursor="pointer"
            onClick={() => props.onOpenOrder(o)}
          >
            <Text fontWeight="semibold" fontSize="sm">
              #{o.id}
            </Text>
            <Text fontSize="sm" color="gray.700" mt="2">
              from: {o.from}
            </Text>
            <Text fontSize="sm" color="gray.700">
              to: {o.to}
            </Text>
          </Box>
        ))}
      </VStack>
    </>
  );
}

export default observer(PassengerOrdersListScreen);
