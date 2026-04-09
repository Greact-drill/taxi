import { useEffect, useState } from 'react';
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';
import type { PassengerOrder, OrdersDeleteResponse, OrdersUpdateResponse } from '@packages/shared';
import { call } from '../api';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';

function PassengerOrderEditScreen(props: {
  order: PassengerOrder;
  onEdited: () => void;
  onDeleted: () => void;
  onCancel: () => void;
}) {
  const store = useStore();
  const [draft, setDraft] = useState<Partial<PassengerOrder>>({ ...props.order });

  async function onSubmit(): Promise<void> {
    store.clearError();
    const from = (draft?.from ?? '').trim();
    const to = (draft?.to ?? '').trim();
    const canSubmit = from.length > 0 && to.length > 0;

    const response = (await call<Partial<PassengerOrder>, OrdersUpdateResponse>('orders:update', draft)) as OrdersUpdateResponse;
    if (response.ok) props.onEdited();
    else store.setError(response.error.message);
  }

  async function onDelete(): Promise<void> {
    store.clearError();

    const response = (await call<Partial<PassengerOrder>, OrdersDeleteResponse>('orders:delete', draft)) as OrdersDeleteResponse;
    if (response.ok) props.onDeleted();
    else store.setError(response.error.message);
  }

  return (
    <Box borderWidth="1px" borderColor="blackAlpha.200" borderRadius="lg" p="4" bg="white">
      <Text fontSize="lg" fontWeight="semibold">
        Заявка #{props.order.id}
      </Text>
      <VStack gap="3" align="stretch" mt="3">
        <Input
          placeholder="Откуда"
          value={draft.from ?? ''}
          onChange={(e) => setDraft((prev) => ({ ...prev, from: e.target.value }))}
        />
        <Input
          placeholder="Куда"
          value={draft.to ?? ''}
          onChange={(e) => setDraft((prev) => ({ ...prev, to: e.target.value }))}
        />
        <Button size="lg" onClick={() => void onSubmit()}>
          Сохранить
        </Button>
        <Button colorPalette="red" variant="outline" onClick={() => void onDelete()}>
          Удалить
        </Button>
        <Button variant="ghost" onClick={props.onCancel}>
          Назад
        </Button>
      </VStack>
    </Box>
  );
}

export default observer(PassengerOrderEditScreen);
