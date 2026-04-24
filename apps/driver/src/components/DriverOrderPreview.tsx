import { Box } from '@chakra-ui/react';
import type { DriverOrder } from '@packages/shared';
import {
  OrderCancelReasonRow,
  OrderCardHeader,
  OrderPassengerRow,
  OrderRouteRow,
} from '@packages/order-ui';
import { OrderStatus } from '@packages/shared';

export type DriverOrderPreviewProps = {
  order: DriverOrder;
  onClick: () => void;
};

export function DriverOrderPreview({ order, onClick }: DriverOrderPreviewProps) {
  const { passenger } = order;

  return (
    <Box
      borderRadius="lg"
      p="4"
      bg="white"
      boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 10px 22px -4px rgba(0, 0, 0, 0.12)'
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      display="flex"
      flexDirection="column"
      gap="3"
    >
      <OrderCardHeader orderId={order.id} status={order.status} createdAt={order.createdAt} />
      <OrderRouteRow from={order.from} to={order.to} />
      {order.status === OrderStatus.CANCELLED && (
        <OrderCancelReasonRow cancelReason={order.cancelReason} />
      )}
      <OrderPassengerRow passenger={passenger} online={false} mx="-4" mb="-4" />
    </Box>
  );
}
