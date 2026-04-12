import { Box } from '@chakra-ui/react';
import type { DriverOrder } from '@packages/shared';
import {
  OrderCancelReasonRow,
  OrderCardHeader,
  OrderPassengerRow,
  OrderRouteRow,
} from '@packages/order-ui';
import { OrderStatus } from '@packages/shared';

export type DriverActiveOrderPreviewProps = {
  order: DriverOrder;
  onClick: () => void;
};

export function DriverActiveOrderPreview({ order, onClick }: DriverActiveOrderPreviewProps) {
  const { passenger } = order;

  return (
    <Box
      borderRadius="md"
      bg="white"
      borderWidth="1px"
      borderColor="blackAlpha.100"
      p="4"
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      transition="background-color 0.15s ease"
      _hover={{ bg: 'gray.50' }}
    >
      <OrderCardHeader orderId={order.id} status={order.status} placementAt={order.createdAt} />
      <OrderRouteRow from={order.from} to={order.to} />
      {order.status === OrderStatus.CANCELLED && (
        <OrderCancelReasonRow cancelReason={order.cancelReason} />
      )}
      <OrderPassengerRow name={passenger.name} phone={passenger.phone} />
    </Box>
  );
}
