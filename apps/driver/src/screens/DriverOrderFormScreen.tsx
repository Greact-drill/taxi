import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { DriverOrderStatusBadge } from '../components/DriverOrderStatusBadge';
import { useStore } from '../store';
import { socket } from '../socket';
import { OrderStatus } from '@packages/shared';

function DriverOrderFormScreen() {
  const store = useStore();
  const order = store.screenFormData!;

  if (!order) {
    return (
      <Button variant="outline" onClick={() => store.openOrdersList()}>
        Назад
      </Button>
    )
  }

  function onSubmit(): void {
    store.clearError();
    socket.emit('driver:orders:take', order);
  }

  const created = new Date(order.createdAt);

  return (
    <Box borderWidth="1px" borderColor="blackAlpha.200" borderRadius="lg" p="4" bg="white">
      <VStack gap="3" align="stretch">
        <Box>
          <Text fontSize="lg" fontWeight="semibold">
            Заявка #{order.id}
          </Text>
          <Text fontSize="xs" color="gray.600" mt="1">
            {created.toLocaleString()}
          </Text>
        </Box>
        <Box>
          <DriverOrderStatusBadge status={order.status} />
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.600">
            Пассажир
          </Text>
          <Text fontSize="sm" fontWeight="medium">
            {order.passenger.name} · {order.passenger.phone}
          </Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.600">
            Откуда
          </Text>
          <Text fontSize="sm">{order.from}</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.600">
            Куда
          </Text>
          <Text fontSize="sm">{order.to}</Text>
        </Box>
        {order.status === OrderStatus.AWAITING_DRIVER && (
          <Button size="lg" onClick={onSubmit}>
            Взять заказ
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
