import { useEffect } from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { socket } from '../socket';

function PassengerOrdersListScreen() {
  const store = useStore();

  useEffect(() => {
    socket.emit('orders:request');
  }, []);

  return (
    <>
      <Text fontSize="lg" fontWeight="semibold">
        Мои заявки
      </Text>

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
            onClick={() => store.openEditOrderForm(o)}
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
        <Button
          type="button"
          variant="outline"
          borderStyle="dashed"
          borderWidth="2px"
          borderRadius="lg"
          p="4"
          h="auto"
          w="100%"
          minH="5.75rem"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => store.openCreateOrderForm()}
        >
          <VStack gap="1" align="center">
            <Text fontSize="3xl" lineHeight="1" fontWeight="medium" color="gray.600">
              +
            </Text>
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" textAlign="center">
              Создать новый заказ
            </Text>
          </VStack>
        </Button>
      </VStack>
    </>
  );
}

export default observer(PassengerOrdersListScreen);
