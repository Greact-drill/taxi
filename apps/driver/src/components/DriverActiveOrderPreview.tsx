import { Box } from '@chakra-ui/react';
import type { DriverOrder } from '@packages/shared';
import {
  OrderPassengerRow,
  OrderRouteRow,
  OrderCardHeader,
} from '@packages/order-ui';

export type DriverActiveOrderPreviewProps = {
  order: DriverOrder;
  onClick: () => void;
};

export function DriverActiveOrderPreview({ order, onClick }: DriverActiveOrderPreviewProps) {
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
    >
      <OrderCardHeader orderId={order.id} status={order.status} createdAt={order.createdAt} />
      <OrderRouteRow from={order.from} to={order.to} />
      <OrderPassengerRow name={passenger.name} phone={passenger.phone} />
    </Box>
  );
}
