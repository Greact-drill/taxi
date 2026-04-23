import {
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { OrderStatus, type Order } from '@packages/shared';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { DriverSelect } from './DriverSelect';
import { EventDateTimeField } from './EventDateTimeField';
import { PassengerSelect } from './PassengerSelect';
import { StatusSelect } from './StatusSelect';
import { socket } from '../socket';
import { store } from '../store';

export type OrderEditDialogProps = {
  order: Order;
  close: () => void;
};

export function OrderEditDialog(props: OrderEditDialogProps) {
  const [draft, setDraft] = useState<Order>({ ...props.order });

  const canSave = draft.createdAt.trim().length > 0 && draft.from.trim().length > 0 && draft.to.trim().length > 0;

  function onSave(): void {
    if (!canSave) return;
    store.clearError();
    socket.emit('dispatcher:orders:update', props.order.id, draft);
    props.close();
  }

  function onDelete(): void {
    store.clearError();
    socket.emit('dispatcher:orders:delete', props.order.id);
    props.close();
  }

  return (
    <>
      <DialogHeader>
        <HStack align="center" gap="3" w="100%">
          <Button
            variant="outline"
            onClick={props.close}
            w="10"
            h="10"
            minW="10"
            p="0"
            aria-label="Назад"
            flexShrink={0}
          >
            <ArrowLeft size={18} aria-hidden />
          </Button>
          <DialogTitle flex="1" minW={0} lineHeight="1.2">
            Заявка #{draft.id}
          </DialogTitle>
          <DialogCloseTrigger />
        </HStack>
      </DialogHeader>
      <DialogBody>
        <VStack gap="3" align="stretch">
          <EventDateTimeField
            iso={draft.createdAt}
            onChange={(nextIso) => setDraft({ ...draft, createdAt: nextIso })}
          />

          <PassengerSelect
            passengers={store.passengers}
            value={draft.passenger}
            onChange={(passenger) => setDraft({ ...draft, passenger })}
          />

          <Input
            placeholder="Откуда"
            value={draft.from}
            onChange={(e) => setDraft({ ...draft, from: e.target.value })}
          />
          <Input
            placeholder="Куда"
            value={draft.to}
            onChange={(e) => setDraft({ ...draft, to: e.target.value })}
          />

          <DriverSelect
            drivers={store.drivers}
            value={draft.driver}
            onChange={(driver) => setDraft({ ...draft, driver })}
          />

          <StatusSelect
            value={draft.status}
            onChange={(status) => setDraft({ ...draft, status })}
          />

          {draft.status === OrderStatus.CANCELLED && (
            <Input
              placeholder="Причина отмены"
              value={draft.cancelReason ?? ''}
              onChange={(e) => setDraft({ ...draft, cancelReason: e.target.value || undefined })}
            />
          )}

          <VStack align="stretch" gap="2">
            <Button onClick={onSave} disabled={!canSave}>
              Сохранить
            </Button>
            <Button colorPalette="red" variant="outline" onClick={onDelete}>
              Удалить
            </Button>
          </VStack>
        </VStack>
      </DialogBody>
    </>
  );
}
