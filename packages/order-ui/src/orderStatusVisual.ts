import type { LucideIcon } from 'lucide-react';
import { Car, CircleCheck, CircleX, MapPin, Route, Search } from 'lucide-react';
import { OrderStatus } from '@packages/shared';

type StatusColorPalette = 'gray' | 'blue' | 'orange' | 'teal' | 'green' | 'red' | 'yellow';

export type OrderStatusVisual = {
  Icon: LucideIcon;
  colorPalette: StatusColorPalette;
  label: string;
};

export const ORDER_STATUS_VISUAL: Record<OrderStatus, OrderStatusVisual> = {
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
    colorPalette: 'orange',
    label: 'Водитель на месте',
  },
  [OrderStatus.ON_TRIP]: {
    Icon: Route,
    colorPalette: 'gray',
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

export function orderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_VISUAL[status].label;
}
