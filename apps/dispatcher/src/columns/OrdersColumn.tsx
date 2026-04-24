import { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { OrderCardHeader, OrderDriverRow, OrderPassengerRow, OrderRouteRow } from '@packages/order-ui';
import { observer } from 'mobx-react-lite';

import { Card } from '../components/Card';
import { DispatcherColumn } from '../components/DispatcherColumn';
import { socket } from '../socket';
import { checkOnline, store } from '../store';

function OrdersColumn() {
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
        <Card 
          key={order.id} 
          cursor="pointer" 
          onClick={() => store.openEditOrderForm(order)}
          display="flex"
          flexDirection="column"
          p="4"
          gap="3"
        >
          <OrderCardHeader orderId={order.id} status={order.status} createdAt={order.createdAt} />            
          <OrderRouteRow from={order.from} to={order.to} />
          <OrderPassengerRow
            passenger={order.passenger}
            online={checkOnline(`passenger:${order.passenger.id}`)}
            mx={'-4'} mb={order.driver ? '-4' : undefined}
          />
          {order.driver && (
            <OrderDriverRow
              driver={order.driver}
              online={checkOnline(`driver:${order.driver.id}`)}
              mx={'-4'} mb="-4"
            />
          )}
        </Card>
      ))}
    </DispatcherColumn>
  );
};

export default observer(OrdersColumn);
