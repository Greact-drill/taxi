import { Badge, HStack } from '@chakra-ui/react';
import { OrderStatus } from '@packages/shared';
import { ORDER_STATUS_VISUAL } from './orderStatusVisual';

export type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const visual = ORDER_STATUS_VISUAL[status];
  const StatusIcon = visual.Icon;

  return (
    <Badge
      colorPalette={visual.colorPalette}
      variant="subtle"
      fontSize="xs"
      fontWeight="medium"
      px="2"
      py="1"
      borderRadius="full"
      flexShrink={0}
    >
      <HStack gap="1.5" align="center">
        <StatusIcon size={16} strokeWidth={2} aria-hidden />
        {visual.label}
      </HStack>
    </Badge>
  );
}
