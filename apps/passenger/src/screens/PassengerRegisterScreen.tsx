import { useState } from 'react';
import type { Passenger } from '@packages/shared';
import { RegisterMode } from '../modes/RegisterMode';
import { setTokenReconnect } from '../socket';
import { useStore } from '../store';
import { api } from '../api';

export function PassengerRegisterScreen() {
  const store = useStore();
  const [passengerDraft, setPassengerDraft] = useState<Partial<Passenger>>({});

  async function onRegister(): Promise<void> {
    store.clearError();
    const name = passengerDraft.name?.trim() ?? '';
    const phone = passengerDraft.phone?.trim() ?? '';

    // const res = (await call<
    //   { name: string; phone: string },
    //   AuthRegisterResponse
    // >('auth:register', { name, phone })) as AuthRegisterResponse;

    // if (!res.ok) {
    //   props.onError(res.error.message);
    //   return;
    // }
    const res = await api.register({ name, phone });
    if (res.ok) setTokenReconnect(res.data.token);
    else store.setError(res.error.message);
  }

  return (
    <RegisterMode
      value={passengerDraft}
      onChange={(patch) => setPassengerDraft((prev) => ({ ...prev, ...patch }))}
      onSubmit={() => void onRegister()}
    />
  );
}

