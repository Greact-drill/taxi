import { NativeSelect } from '@chakra-ui/react';
import type { Driver } from '@packages/shared';

export type DriverSelectProps = {
  drivers: Driver[];
  value?: Driver;
  onChange: (driver: Driver) => void;
};

export function DriverSelect({ drivers, value, onChange }: DriverSelectProps) {
  return (
    <NativeSelect.Root>
      <NativeSelect.Field
        value={value ? String(value.id) : ''}
        onChange={(e) => {
          const selectedId = Number(e.target.value);
          const driver = drivers.find((d) => d.id === selectedId);
          if (driver) onChange(driver);
        }}
      >
        {drivers.map((d) => (
          <option key={d.id} value={d.id}>
            #{d.id} {d.name} ({d.car})
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}
