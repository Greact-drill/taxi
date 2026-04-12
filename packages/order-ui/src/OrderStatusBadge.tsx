import { Badge, HStack } from '@chakra-ui/react';
import type { LucideIcon } from 'lucide-react';
import { Car, CircleCheck, CircleX, MapPin, Route, Search } from 'lucide-react';
import { OrderStatus } from '@packages/shared';

type StatusColorPalette = 'gray' | 'blue' | 'orange' | 'teal' | 'green' | 'red' | 'yellow';

type StatusVisual = {
  Icon: LucideIcon;
  colorPalette: StatusColorPalette;
  label: string;
};

const ORDER_STATUS_VISUAL: Record<OrderStatus, StatusVisual> = {
  [OrderStatus.AWAITING_DRIVER]: {
    Icon: Search,
    colorPalette: 'yellow',
    label: 'Подбираем водителя',
  },
  [OrderStatus.DRIVER_ASSIGNED]: {
    Icon: Car,
    colorPalette: 'green',
    label: 'Водитель назначен',
  },
  [OrderStatus.DRIVER_ARRIVED]: {
    Icon: MapPin,
    colorPalette: 'blue',
    label: 'Водитель на месте',
  },
  [OrderStatus.ON_TRIP]: {
    Icon: Route,
    colorPalette: 'teal',
    label: 'В пути',
  },
  [OrderStatus.COMPLETED]: {
    Icon: CircleCheck,
    colorPalette: 'gray',
    label: 'Завершён',
  },
  [OrderStatus.CANCELLED]: {
    Icon: CircleX,
    colorPalette: 'red',
    label: 'Отменён',
  },
};

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
