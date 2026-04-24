import { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { OrderCardHeader, OrderRouteRow } from '@packages/order-ui';
import { observer } from 'mobx-react-lite';

import { Card } from '../components/Card';
import { DispatcherColumn } from '../components/DispatcherColumn';
import { OrderDriverRow } from '../components/OrderDriverRow';
import { OrderPassengerRow } from '../components/OrderPassengerRow';
import { socket } from '../socket';
import { checkOnline, store } from '../store';

export const OrdersColumn = observer(function OrdersColumn() {
  const { orders } = store;

  useEffect(() => {
    socket.emit('dispatcher:orders:request');
  }, [socket.id]);

  return (
    <DispatcherColumn>
      <Text px="3" py="2" fontWeight="semibold" fontSize="sm">
        Заявки
      </Text>
      {orders.map((order) => (
        <Card key={order.id} cursor="pointer" onClick={() => store.openEditOrderForm(order)}>
          <Box px="3" pt="3" pb="2">
            <OrderCardHeader orderId={order.id} status={order.status} createdAt={order.createdAt} />
            <OrderRouteRow from={order.from} to={order.to} />
          </Box>
          <OrderPassengerRow passenger={order.passenger} online={checkOnline(`passenger:${order.passenger.id}`)} />
          {order.driver ? <OrderDriverRow driver={order.driver} online={checkOnline(`driver:${order.driver.id}`)} /> : null}
        </Card>
      ))}
    </DispatcherColumn>
  );
});
