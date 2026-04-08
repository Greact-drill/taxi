import { useState } from 'react';
import type { Order, OrdersCreateResponse } from '@packages/shared';
import { call } from '../api';
import { OrderCreateMode } from '../modes/OrderCreateMode';

export function PassengerOrderCreateScreen(props: {
  onCreated: (item: Order) => void;
  onCancel: () => void;
  onError: (message: string | null) => void;
}) {
  const [draft, setDraft] = useState<Partial<Order>>({ from: '', to: '' });

  async function onSubmit(): Promise<void> {
    props.onError(null);
    const from = draft.from?.trim() ?? '';
    const to = draft.to?.trim() ?? '';

    const res = (await call<{ from: string; to: string }, OrdersCreateResponse>('orders:create', {
      from,
      to,
    })) as OrdersCreateResponse;

    if (!res.ok) {
      props.onError(res.error.message);
      return;
    }

    props.onCreated(res.data.item);
    setDraft({ from: '', to: '' });
  }

  return (
    <OrderCreateMode
      from={draft.from ?? ''}
      to={draft.to ?? ''}
      onChangeFrom={(v) => setDraft((prev) => ({ ...prev, from: v }))}
      onChangeTo={(v) => setDraft((prev) => ({ ...prev, to: v }))}
      onSubmit={() => void onSubmit()}
      onCancel={props.onCancel}
    />
  );
}

