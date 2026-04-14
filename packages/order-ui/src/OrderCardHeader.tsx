import { Box, HStack, Text } from '@chakra-ui/react';
import type { OrderStatus } from '@packages/shared';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatEvent } from './formatEvent';

export type OrderCardHeaderProps = {
  orderId: number;
  status: OrderStatus;
  createdAt?: string;
};

export function OrderCardHeader({ orderId, status, createdAt }: OrderCardHeaderProps) {

  return (
    <HStack justify="space-between" align="flex-start" gap="3" flexWrap="nowrap">
      <HStack gap="2" align="baseline" flexWrap="nowrap" flex="1" minW={0}>
        <Text fontWeight="semibold" fontSize="md" color="gray.900" whiteSpace="nowrap">
          Заказ #{orderId}
        </Text>
        <Text
          as="span"
          fontSize="xs"
          color="gray.500"
          fontWeight="normal"
          whiteSpace="nowrap"
          title={new Date(createdAt!).toLocaleString()}
        >
          {formatEvent(createdAt!)}
        </Text>
      </HStack>
      <Box flexShrink={0}>
        <OrderStatusBadge status={status} />
      </Box>
    </HStack>
  );
}
