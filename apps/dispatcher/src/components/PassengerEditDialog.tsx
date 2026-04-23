import {
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  HStack,
  Input,
  VStack,
} from '@chakra-ui/react';
import type { Passenger } from '@packages/shared';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { socket } from '../socket';
import { store } from '../store';

export type PassengerEditDialogProps = {
  passenger: Passenger;
  close: () => void;
};

export function PassengerEditDialog(props: PassengerEditDialogProps) {
  // Компонент отвечает только за контент редактирования.
  // Модальная оболочка и жизненный цикл открытия/закрытия находятся в колонке.
  const [draft, setDraft] = useState<Passenger>({ ...props.passenger });

  const name = draft.name.trim();
  const phone = draft.phone.trim();
  const canSave = name.length > 0 && phone.length > 0;

  function onSave(): void {
    store.clearError();
    socket.emit('dispatcher:passengers:update', props.passenger.id, draft);
    props.close();
  }

  function onDelete(): void {
    store.clearError();
    socket.emit('dispatcher:passengers:delete', props.passenger.id);
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
            Пассажир #{props.passenger.id}
          </DialogTitle>
          <DialogCloseTrigger />
        </HStack>
      </DialogHeader>
      <DialogBody>
        <VStack gap="3" align="stretch">
          <Input
            placeholder="Имя"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <Input
            placeholder="Телефон"
            value={draft.phone}
            onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
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
