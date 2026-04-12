import { Box, HStack, Text } from '@chakra-ui/react';
import type { OrderStatus } from '@packages/shared';
import { OrderStatusBadge } from './OrderStatusBadge';

function formatOrderPlacement(placementAt: string): string {
  const d = new Date(placementAt);
  if (Number.isNaN(d.getTime())) return '';
  const date = d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return `${date} ${time}`;
}

export type OrderCardHeaderProps = {
  orderId: number;
  status: OrderStatus;
  /** ISO instant of order placement (`createdAt`). Omit to hide the date segment. */
  placementAt?: string;
};

export function OrderCardHeader({ orderId, status, placementAt }: OrderCardHeaderProps) {
  const placementLabel =
    placementAt != null && placementAt !== '' ? formatOrderPlacement(placementAt) : '';

  return (
    <HStack justify="space-between" align="flex-start" gap="3">
      <HStack gap="2" align="baseline" flexWrap="wrap" flex="1" minW={0}>
        <Text fontWeight="semibold" fontSize="md" color="gray.900">
          Заказ #{orderId}
        </Text>
        {placementLabel ? (
          <Text
            as="span"
            fontSize="xs"
            color="gray.500"
            fontWeight="normal"
            title={new Date(placementAt!).toLocaleString()}
          >
            {placementLabel}
          </Text>
        ) : null}
      </HStack>
      <Box flexShrink={0}>
        <OrderStatusBadge status={status} />
      </Box>
    </HStack>
  );
}
