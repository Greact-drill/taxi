import { NativeSelect } from '@chakra-ui/react';
import { orderStatusLabel } from '@packages/order-ui';
import { OrderStatus } from '@packages/shared';

export type StatusSelectProps = {
  value: OrderStatus;
  onChange: (status: OrderStatus) => void;
};

const STATUSES = Object.values(OrderStatus) as OrderStatus[];

export function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <NativeSelect.Root>
      <NativeSelect.Field
        value={value}
        onChange={(e) => onChange(e.target.value as OrderStatus)}
      >
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {orderStatusLabel(status)}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}
