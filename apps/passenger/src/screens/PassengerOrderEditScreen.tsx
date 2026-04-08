import { useEffect, useState } from 'react';
import type { Order, OrdersDeleteResponse, OrdersUpdateResponse } from '@packages/shared';
import { call } from '../api';
import { OrderEditMode } from '../modes/OrderEditMode';

export function PassengerOrderEditScreen(props: {
  order: Order;
  onBack: () => void;
  onError: (message: string | null) => void;
}) {
  const [draft, setDraft] = useState<Partial<Order>>({ from: props.order.from, to: props.order.to });

  useEffect(() => {
    setDraft({ from: props.order.from, to: props.order.to });
  }, [props.order.id, props.order.from, props.order.to]);

  async function onSubmit(): Promise<void> {
    props.onError(null);
    const from = draft.from?.trim() ?? '';
    const to = draft.to?.trim() ?? '';

    const res = (await call<{ id: number; from: string; to: string }, OrdersUpdateResponse>('orders:update', {
      id: props.order.id,
      from,
      to,
    })) as OrdersUpdateResponse;

    if (!res.ok) {
      props.onError(res.error.message);
      return;
    }

    props.onBack();
  }

  async function onDelete(): Promise<void> {
    props.onError(null);
    const res = (await call<{ id: number }, OrdersDeleteResponse>('orders:delete', {
      id: props.order.id,
    })) as OrdersDeleteResponse;

    if (!res.ok) {
      props.onError(res.error.message);
      return;
    }

    props.onBack();
  }

  return (
    <OrderEditMode
      order={props.order}
      from={draft.from ?? ''}
      to={draft.to ?? ''}
      onChangeFrom={(v) => setDraft((prev) => ({ ...prev, from: v }))}
      onChangeTo={(v) => setDraft((prev) => ({ ...prev, to: v }))}
      onSubmit={() => void onSubmit()}
      onDelete={() => void onDelete()}
      onBack={props.onBack}
    />
  );
}

