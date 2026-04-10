import { Badge, HStack } from '@chakra-ui/react';
import type { LucideIcon } from 'lucide-react';
import {
  Car,
  CircleCheck,
  CircleX,
  Inbox,
  Route,
  UserRound,
} from 'lucide-react';
import { OrderStatus } from '@packages/shared';

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

const DRIVER_ORDER_STATUS_VISUAL: Record<OrderStatus, OrderStatusVisual> = {
  [OrderStatus.AWAITING_DRIVER]: {
    Icon: Inbox,
    colorPalette: 'gray',
    label: 'Новый заказ',
  },
  [OrderStatus.DRIVER_ASSIGNED]: {
    Icon: Car,
    colorPalette: 'blue',
    label: 'Взял',
  },
  [OrderStatus.DRIVER_ARRIVED]: {
    Icon: UserRound,
    colorPalette: 'orange',
    label: 'Жду пассажира',
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

export type DriverOrderStatusBadgeProps = {
  status: OrderStatus;
};

export function DriverOrderStatusBadge({ status }: DriverOrderStatusBadgeProps) {
  const visual = DRIVER_ORDER_STATUS_VISUAL[status];
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
