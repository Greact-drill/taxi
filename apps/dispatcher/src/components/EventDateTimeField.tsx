import * as React from 'react';
import { Input } from '@chakra-ui/react';

type Props = {
  iso: string;
  onChange: (iso: string) => void;
};

/** UTC instant → `YYYY-MM-DDTHH:mm` for `<input type="datetime-local">` (local wall clock). */
function utcIsoToDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day}T${h}:${min}`;
}

/** Local `datetime-local` value → UTC ISO string (same contract as `Date#toISOString`). */
function datetimeLocalValueToUtcIso(local: string): string {
  return new Date(local).toISOString();
}

export function EventDateTimeField({ iso, onChange }: Props) {
  const value = React.useMemo(() => utcIsoToDatetimeLocalValue(iso), [iso]);

  return (
    <Input
      type="datetime-local"
      step={60}
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        onChange(datetimeLocalValueToUtcIso(v));
      }}
    />
  );
}
