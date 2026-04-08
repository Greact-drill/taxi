import { useState } from 'react';
import type { AuthRegisterResponse, Passenger } from '@packages/shared';
import { call } from '../api';
import { RegisterMode } from '../modes/RegisterMode';

export function PassengerRegisterScreen(props: {
  onRegistered: (token: string, passenger: Passenger) => void;
  onError: (message: string | null) => void;
}) {
  const [passengerDraft, setPassengerDraft] = useState<Partial<Passenger>>({});

  async function onRegister(): Promise<void> {
    props.onError(null);
    const name = passengerDraft.name?.trim() ?? '';
    const phone = passengerDraft.phone?.trim() ?? '';

    const res = (await call<
      { name: string; phone: string },
      AuthRegisterResponse
    >('auth:register', { name, phone })) as AuthRegisterResponse;

    if (!res.ok) {
      props.onError(res.error.message);
      return;
    }

    props.onRegistered(res.data.token, res.data.passenger);
  }

  return (
    <RegisterMode
      value={passengerDraft}
      onChange={(patch) => setPassengerDraft((prev) => ({ ...prev, ...patch }))}
      onSubmit={() => void onRegister()}
    />
  );
}

