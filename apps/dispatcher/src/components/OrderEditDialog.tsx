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
import { OrderStatus, type Driver, type Order, type Passenger } from '@packages/shared';
import { ArrowLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import { socket } from '../socket';
import { store } from '../store';

export type OrderEditDialogProps = {
  order: Order;
  close: () => void;
};

export function OrderEditDialog(props: OrderEditDialogProps) {
  const [draft, setDraft] = useState<Order>({ ...props.order });

  const canSave = draft.createdAt.trim().length > 0 && draft.from.trim().length > 0 && draft.to.trim().length > 0;

  const driversById = useMemo(() => {
    const map = new Map<number, Driver>();
    for (const d of store.drivers) map.set(d.id, d);
    return map;
  }, [store.drivers]);

  const passengersById = useMemo(() => {
    const map = new Map<number, Passenger>();
    for (const p of store.passengers) map.set(p.id, p);
    return map;
  }, [store.passengers]);

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
          <Input
            placeholder="Дата создания"
            value={draft.createdAt}
            onChange={(e) => setDraft({ ...draft, createdAt: e.target.value })}
          />

          <VStack align="stretch" gap="1">
            <Text fontSize="sm" color="gray.600">
              Пассажир
            </Text>
            <select
              value={String(draft.passenger.id)}
              onChange={(e) => {
                const next = passengersById.get(Number(e.target.value));
                if (next) setDraft({ ...draft, passenger: next });
              }}
            >
              {store.passengers.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.id} {p.name} ({p.phone})
                </option>
              ))}
            </select>
          </VStack>

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

          <VStack align="stretch" gap="1">
            <Text fontSize="sm" color="gray.600">
              Водитель
            </Text>
            <select
              value={draft.driver ? String(draft.driver.id) : ''}
              onChange={(e) => {
                const value = e.target.value;
                if (!value) {
                  setDraft({ ...draft, driver: undefined });
                  return;
                }
                const next = driversById.get(Number(value));
                if (next) setDraft({ ...draft, driver: next });
              }}
            >
              <option value="">Без водителя</option>
              {store.drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  #{d.id} {d.name} ({d.car})
                </option>
              ))}
            </select>
          </VStack>

          <VStack align="stretch" gap="1">
            <Text fontSize="sm" color="gray.600">
              Статус
            </Text>
            <select
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as OrderStatus })}
            >
              {Object.values(OrderStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </VStack>

          <Input
            placeholder="Причина отмены"
            value={draft.cancelReason ?? ''}
            onChange={(e) => setDraft({ ...draft, cancelReason: e.target.value || undefined })}
          />

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
