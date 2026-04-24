import { Box } from '@chakra-ui/react';
import type { DriverOrder } from '@packages/shared';
import {
  OrderPassengerRow,
  OrderRouteRow,
  OrderCardHeader,
} from '@packages/order-ui';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';

export type DriverActiveOrderPreviewProps = {
  order: DriverOrder;
  onClick: () => void;
};

function DriverActiveOrderPreview({ order, onClick }: DriverActiveOrderPreviewProps) {
  const { onlines } = useStore();
  const { passenger } = order;

  return (
    <Box
      flexShrink={0}
      borderRadius="md"
      bg="white"
      borderWidth="1px"
      borderColor="blackAlpha.100"
      p="4"
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}

      display="flex"
      flexDirection="column"
      gap="3"
    >
      <OrderCardHeader orderId={order.id} status={order.status} createdAt={order.createdAt} />
      <OrderRouteRow from={order.from} to={order.to} />
      <OrderPassengerRow 
        passenger={passenger} 
        online={onlines.has(`passenger:${passenger.id}`)} 
        mx="-4" mb="-4" />
    </Box>
  );
}

export default observer(DriverActiveOrderPreview);
