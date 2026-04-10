import { Box, HStack, Text } from '@chakra-ui/react';
import { OrderStatus, type PassengerOrder } from '@packages/shared';
import { PassengerOrderStatusBadge } from './PassengerOrderStatusBadge';
import { PassengerOrderWaitingDial } from './PassengerOrderWaitingDial';

export type PassengerOrderPreviewProps = {
  order: PassengerOrder;
  onClick: () => void;
};

export function PassengerOrderPreview({ order, onClick }: PassengerOrderPreviewProps) {
  const created = new Date(order.createdAt);

  return (
    <Box
      borderWidth="1px"
      borderColor="blackAlpha.200"
      borderRadius="lg"
      p="4"
      bg="white"
      cursor="pointer"
      onClick={onClick}
    >
      <HStack gap="2" align="flex-start" justify="space-between">
        <Text fontWeight="semibold" fontSize="sm">
          Заказ #{order.id}
        </Text>
        <PassengerOrderStatusBadge status={order.status} />
      </HStack>
      <Text fontSize="xs" color="gray.600" mt="1" title={created.toLocaleString()}>
        Создан: {created.toLocaleDateString()} {created.toLocaleTimeString()}
      </Text>
      <Text fontSize="sm" color="gray.700" mt="2">
        Откуда: {order.from}
      </Text>
      <Text fontSize="sm" color="gray.700">
        Куда: {order.to}
      </Text>
      {order.status === OrderStatus.AWAITING_DRIVER && (
        <PassengerOrderWaitingDial createdAt={order.createdAt} />
      )}
      {order.status === OrderStatus.DRIVER_ASSIGNED && (
        <Text fontSize="sm" color="gray.700" mt="2">
          Водитель:{' '}
          <Text as="span" fontWeight="medium">
            {order.driver?.name}
          </Text>
          {' · '}
          {order.driver?.car}
        </Text>
      )}
    </Box>
  );
}
