import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  HStack,
  Input,
  VStack,
} from '@chakra-ui/react';
import type { Passenger } from '@packages/shared';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { store } from '../store';

function clearModalBodyLock(): void {
  const b = document.body;
  b.style.removeProperty('overflow');
  b.style.removeProperty('padding-right');
  b.style.removeProperty('padding-inline-end');
  b.style.removeProperty('pointer-events');
  document.documentElement.style.removeProperty('overflow');
}

export type PassengerEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExitComplete?: () => void;
  passenger: Passenger | null;
};

export function PassengerEditDialog(props: PassengerEditDialogProps) {
  const [draft, setDraft] = useState<Passenger | null>(null);

  useEffect(() => {
    if (props.open && props.passenger) {
      setDraft({ ...props.passenger });
    }
  }, [props.open, props.passenger]);

  if (!props.open && !props.passenger) {
    return null;
  }
  if (!props.passenger) {
    return null;
  }

  const current = props.passenger;

  const name = (draft?.name ?? '').trim();
  const phone = (draft?.phone ?? '').trim();
  const canSave = name.length > 0 && phone.length > 0;

  function onSave(): void {
    if (!draft) return;
    store.clearError();
    socket.emit('dispatcher:passengers:update', current.id, draft);
    props.onOpenChange(false);
  }

  function onDelete(): void {
    store.clearError();
    socket.emit('dispatcher:passengers:delete', current.id);
    props.onOpenChange(false);
  }

  return (
    <DialogRoot
      open={props.open}
      onOpenChange={(d) => props.onOpenChange(d.open)}
      onExitComplete={() => {
        clearModalBodyLock();
        props.onExitComplete?.();
      }}
      size="sm"
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogHeader>
            <HStack align="center" gap="3" w="100%">
              <Button
                variant="outline"
                onClick={() => props.onOpenChange(false)}
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
                Пассажир #{current.id}
              </DialogTitle>
              <DialogCloseTrigger />
            </HStack>
          </DialogHeader>
          <DialogBody>
            <VStack gap="3" align="stretch">
              <Input
                placeholder="Имя"
                value={draft?.name ?? ''}
                onChange={(e) =>
                  setDraft((p) => (p ? { ...p, name: e.target.value } : p))
                }
              />
              <Input
                placeholder="Телефон"
                value={draft?.phone ?? ''}
                onChange={(e) =>
                  setDraft((p) => (p ? { ...p, phone: e.target.value } : p))
                }
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
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}
