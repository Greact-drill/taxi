import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  Input,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import type { Passenger } from '@packages/shared';
import { observer } from 'mobx-react-lite';
import { socket } from '../socket';
import { useStore } from '../store';

function PassengerProfileEditDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const store = useStore();
  const [draft, setDraft] = useState<Passenger>();

  useEffect(() => {
    if (props.open && store.currentUser) {
      setDraft({ ...store.currentUser });
    }
  }, [props.open, store.currentUser]);

  // TODO использовать одну и ту же форму и для регистрации и для редактирования учётных данных
  // PassengerRegisterScreen
  const name = (draft?.name ?? '').trim();
  const phone = (draft?.phone ?? '').trim();
  const isPhoneValid = /^\+?\d+$/.test(phone);
  const canSubmit = draft != null && name.length > 0 && phone.length > 0 && isPhoneValid;
  // TODO validation messages

  function onSubmit(): void {
    socket.emit('passenger:profile:update', draft);
    props.onOpenChange(false);
  }

  return (
    <DialogRoot
      open={props.open}
      onOpenChange={(d) => props.onOpenChange(d.open)}
      size="sm"
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить свои данные</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody>
            <VStack gap="3" align="stretch">
              <Input
                placeholder="Имя"
                value={draft?.name ?? ''}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev,
                  )
                }
              />
              <Input
                placeholder="Телефон"
                value={draft?.phone ?? ''}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev ? { ...prev, phone: e.target.value } : prev,
                  )
                }
              />
            </VStack>
          </DialogBody>
          <DialogFooter gap="2">
            <Button variant="ghost" onClick={() => props.onOpenChange(false)}>
              Закрыть
            </Button>
            <Button onClick={onSubmit} disabled={!canSubmit}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}

export default observer(PassengerProfileEditDialog);
