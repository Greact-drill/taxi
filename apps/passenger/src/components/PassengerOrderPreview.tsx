import { Box } from '@chakra-ui/react';
import { OrderStatus, type PassengerOrder } from '@packages/shared';
import {
  OrderCancelReasonRow,
  OrderCardHeader,
  OrderDriverRow,
  OrderRouteRow,
} from '@packages/order-ui';
import { PassengerOrderWaitingDial } from './PassengerOrderWaitingDial';

export type PassengerOrderPreviewProps = {
  order: PassengerOrder;
  onClick: () => void;
};

export function PassengerOrderPreview({ order, onClick }: PassengerOrderPreviewProps) {
  return (
    <Box
      borderRadius="lg"
      p="4"
      bg="white"
      boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 10px 22px -4px rgba(0, 0, 0, 0.12)'
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
    >
      <OrderCardHeader orderId={order.id} status={order.status} placementAt={order.createdAt} />
      <OrderRouteRow from={order.from} to={order.to} />
      {order.status === OrderStatus.CANCELLED && (
        <OrderCancelReasonRow cancelReason={order.cancelReason} />
      )}
      {order.status === OrderStatus.AWAITING_DRIVER && (
        <PassengerOrderWaitingDial createdAt={order.createdAt} />
      )}
      {order.driver ? (
        <OrderDriverRow name={order.driver.name} car={order.driver.car} />
      ) : null}
    </Box>
  );
}
