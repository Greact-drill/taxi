import { NativeSelect } from '@chakra-ui/react';
import type { Passenger } from '@packages/shared';

export type PassengerSelectProps = {
  passengers: Passenger[];
  value: Passenger;
  onChange: (passenger: Passenger) => void;
};

export function PassengerSelect({ passengers, value, onChange }: PassengerSelectProps) {
  return (
    <NativeSelect.Root>
      <NativeSelect.Field
        value={String(value.id)}
        onChange={(e) => {
          const selectedId = Number(e.target.value);
          const passenger = passengers.find((p) => p.id === selectedId);
          if (passenger) onChange(passenger);
        }}
      >
        {passengers.map((p) => (
          <option key={p.id} value={p.id}>
            #{p.id} {p.name} ({p.phone})
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}
