import { useState } from 'react';
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';
import type { Order, OrdersCreateResponse, PassengerOrder } from '@packages/shared';
import { call } from '../api';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';

function PassengerOrderCreateScreen(props: {
  onCreated: () => void;
  onCancel: () => void;
}) {
  const store = useStore();
  const [draft, setDraft] = useState<Partial<PassengerOrder>>({});

  const from = (draft?.from ?? '').trim();
  const to = (draft?.to ?? '').trim();
  const canSubmit = from.length > 0 && to.length > 0;

  async function onSubmit(): Promise<void> {
    store.clearError();

    const response = (await call<Partial<PassengerOrder>, OrdersCreateResponse>('orders:create', draft)) as OrdersCreateResponse;
    if (response.ok) props.onCreated();
    else store.setError(response.error.message);
  }

  return (
    <Box borderWidth="1px" borderColor="blackAlpha.200" borderRadius="lg" p="4" bg="white">
      <Text fontSize="lg" fontWeight="semibold">
        Новая заявка
      </Text>
      <VStack gap="3" align="stretch" mt="3">
        <Input placeholder="Откуда" value={draft.from ?? ''} onChange={(e) => setDraft((prev) => ({ ...prev, from: e.target.value }))} />
        <Input placeholder="Куда" value={draft.to ?? ''} onChange={(e) => setDraft((prev) => ({ ...prev, to: e.target.value }))} />
        <Button size="lg" onClick={() => void onSubmit()} disabled={!canSubmit}>
          Создать
        </Button>
        <Button variant="ghost" onClick={props.onCancel}>
          Отмена
        </Button>
      </VStack>
    </Box>
  );
}

export default observer(PassengerOrderCreateScreen);
