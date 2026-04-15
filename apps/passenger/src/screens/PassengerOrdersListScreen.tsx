import { useEffect } from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { PassengerOrderPreview } from '../components/PassengerOrderPreview';
import { useStore } from '../store';
import { socket } from '../socket';
import { OrderStatus } from '@packages/shared';

const CREATABLE_STATUSES: OrderStatus[] = [
  OrderStatus.ON_TRIP,
  OrderStatus.COMPLETED,
  OrderStatus.CANCELLED,
];

function PassengerOrdersListScreen() {
  const store = useStore();

  useEffect(() => {
    socket.emit('passenger:orders:request');
  }, [socket.id]);

  const canAdd = store.orders.every((storeOrder) =>
    CREATABLE_STATUSES.includes(storeOrder.status),
  );

  return (
    <VStack gap="3" align="stretch">
      {store.orders.map((order) => (
        <PassengerOrderPreview
          key={order.id}
          order={order}
          onClick={() => store.openEditOrderForm(order)}
        />
      ))}
      {canAdd && (
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
            <Box color="colorPalette.fg" lineHeight="0">
              <Plus size={32} strokeWidth={2} aria-hidden />
            </Box>
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" textAlign="center">
              Создать новый заказ
            </Text>
          </VStack>
        </Button>
      )}
    </VStack>
  );
}

export default observer(PassengerOrdersListScreen);
