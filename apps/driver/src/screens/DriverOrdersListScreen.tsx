import { useEffect } from 'react';
import { VStack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { DriverOrderPreview } from '../components/DriverOrderPreview';
import { useStore } from '../store';
import { socket } from '../socket';

function DriverOrdersListScreen() {
  const store = useStore();

  useEffect(() => {
    socket.emit('driver:orders:active:request');
    socket.emit('driver:orders:request');
  }, []);

  return (
    <>
      <VStack gap="3" align="stretch">
        <Text fontSize="lg" fontWeight="semibold">
          Назначенные заказы
        </Text>
        {store.assignedOrders.map((order) => (
          <DriverOrderPreview
            key={order.id}
            order={order}
            onClick={() => store.openOrderForm(order)}
          />
        ))}
      </VStack>

      <VStack gap="3" align="stretch">
        <Text fontSize="lg" fontWeight="semibold">
          Активные заказы
        </Text>
        {store.activeOrders.map((order) => (
          <DriverOrderPreview
            key={order.id}
            order={order}
            onClick={() => store.openOrderForm(order)}
          />
        ))}
      </VStack>
    </>
  );
}

export default observer(DriverOrdersListScreen);
