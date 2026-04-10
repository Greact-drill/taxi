import { Badge, HStack } from '@chakra-ui/react';
import type { LucideIcon } from 'lucide-react';
import { Car, CircleCheck, CircleX, MapPin, Route, Search } from 'lucide-react';
import { OrderStatus } from '@packages/shared';

/** Chakra `Badge` / `colorPalette` values used for order status. */
type OrderStatusColorPalette =
  | 'gray'
  | 'blue'
  | 'orange'
  | 'teal'
  | 'green'
  | 'red';

type OrderStatusVisual = {
  Icon: LucideIcon;
  colorPalette: OrderStatusColorPalette;
  label: string;
};

const ORDER_STATUS_VISUAL: Record<OrderStatus, OrderStatusVisual> = {
  [OrderStatus.AWAITING_DRIVER]: {
    Icon: Search,
    colorPalette: 'gray',
    label: 'Ищем водителя',
  },
  [OrderStatus.DRIVER_ASSIGNED]: {
    Icon: Car,
    colorPalette: 'blue',
    label: 'Водитель назначен',
  },
  [OrderStatus.DRIVER_ARRIVED]: {
    Icon: MapPin,
    colorPalette: 'orange',
    label: 'Водитель на месте',
  },
  [OrderStatus.ON_TRIP]: {
    Icon: Route,
    colorPalette: 'teal',
    label: 'В пути',
  },
  [OrderStatus.COMPLETED]: {
    Icon: CircleCheck,
    colorPalette: 'green',
    label: 'Завершён',
  },
  [OrderStatus.CANCELLED]: {
    Icon: CircleX,
    colorPalette: 'red',
    label: 'Отменён',
  },
};

export type PassengerOrderStatusBadgeProps = {
  status: OrderStatus;
};

export function PassengerOrderStatusBadge({ status }: PassengerOrderStatusBadgeProps) {
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
