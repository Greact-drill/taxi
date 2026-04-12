import { Box, Button, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import {
  OrderCardHeader,
  OrderPassengerRow,
  OrderRouteRow,
} from '@packages/order-ui';
import { OrderStatus } from '@packages/shared';
import { useStore } from '../store';
import { socket } from '../socket';

function DriverOrderFormScreen() {
  const store = useStore();
  const order = store.screenFormData!;

  if (!order) {
    return (
      <Button variant="outline" onClick={() => store.openOrdersList()}>
        Назад
      </Button>
    );
  }

  function onSubmit(): void {
    store.clearError();
    socket.emit('driver:orders:take', order);
  }

  return (
    <Box
      borderRadius="lg"
      p="4"
      bg="white"
      boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 10px 22px -4px rgba(0, 0, 0, 0.12)'
      overflow="hidden"
    >
      <OrderCardHeader orderId={order.id} status={order.status} placementAt={order.createdAt} />
      <OrderRouteRow from={order.from} to={order.to} />
      <OrderPassengerRow
        name={order.passenger.name}
        phone={order.passenger.phone}
        attachToCardBottom={false}
      />
      <VStack gap="3" align="stretch" mt="4">
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
