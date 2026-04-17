import { useEffect } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { OrderCardHeader } from '@packages/order-ui';
import { observer } from 'mobx-react-lite';

import { DispatcherColumn } from '../components/DispatcherColumn';
import { OrderDriverRow } from '../components/OrderDriverRow';
import { OrderPassengerRow } from '../components/OrderPassengerRow';
import { socket } from '../socket';
import { store } from '../store';

export const OrdersColumn = observer(function OrdersColumn() {
  const { online, orders } = store;

  useEffect(() => {
    socket.emit('dispatcher:orders:request');
  }, [socket.id]);

  return (
    <DispatcherColumn>
      <Text px="3" py="2" fontWeight="semibold" fontSize="sm">
        Заявки
      </Text>
      {orders.map((order) => (
        <VStack key={order.id} align="stretch" gap={0}>
          <Box px="3" pt="3" pb="1">
            <OrderCardHeader orderId={order.id} status={order.status} createdAt={order.createdAt} />
          </Box>
          <OrderPassengerRow passenger={order.passenger} online={online} />
          {order.driver ? <OrderDriverRow driver={order.driver} online={online} /> : null}
        </VStack>
      ))}
    </DispatcherColumn>
  );
});
