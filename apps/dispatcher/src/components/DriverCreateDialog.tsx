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
import type { DriverCreateInput } from '@packages/shared';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { socket } from '../socket';
import { store } from '../store';

function generatePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]!).join('');
}

const emptyDraft = (): DriverCreateInput => ({
  name: '',
  car: '',
  login: '',
  password: '',
});

export type DriverCreateDialogProps = {
  close: () => void;
};

export function DriverCreateDialog(props: DriverCreateDialogProps) {
  // Черновик не сбрасываем при каждом open: инстанс остаётся смонтированным, пользователь может
  // закрыть диалог с частично заполненной формой и продолжить позже. Пустой шаблон — только после
  // успешной отправки (и при первом mount).
  const [draft, setDraft] = useState<DriverCreateInput>(emptyDraft);

  const name = draft.name.trim();
  const car = draft.car.trim();
  const login = draft.login.trim();
  const password = draft.password.trim();
  const canSubmit = name.length > 0 && car.length > 0 && login.length > 0 && password.length > 0;

  function onSubmit(): void {
    if (!canSubmit) return;
    store.clearError();
    socket.emit('dispatcher:drivers:create', {
      name,
      car,
      login,
      password,
    });
    setDraft(emptyDraft());
    props.close();
  }

  function onGeneratePassword(): void {
    setDraft({ ...draft, password: generatePassword() });
  }

  function onCopyCreds(): void {
    const pwd = draft.password.trim();
    const l = draft.login.trim();
    const text = `Добрый день! Данные для входа: логин ${l}, пароль ${pwd}. Не передавайте их посторонним.`;
    void navigator.clipboard.writeText(text);
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
            Новый водитель
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
            placeholder="Автомобиль"
            value={draft.car}
            onChange={(e) => setDraft({ ...draft, car: e.target.value })}
          />
          <Input
            placeholder="Логин"
            value={draft.login}
            onChange={(e) => setDraft({ ...draft, login: e.target.value })}
          />
          <Input
            placeholder="Пароль"
            value={draft.password}
            onChange={(e) => setDraft({ ...draft, password: e.target.value })}
          />
          <HStack gap="2" flexWrap="wrap" justify="space-between">
            <Button variant="outline" size="sm" onClick={onGeneratePassword}>
              🎲 Случайный
            </Button>
            <Button variant="outline" size="sm" onClick={onCopyCreds} disabled={!draft.password.trim()}>
              📋 Скопировать для отправки
            </Button>
          </HStack>
          <Button onClick={onSubmit} disabled={!canSubmit}>
            Зарегистрировать
          </Button>
        </VStack>
      </DialogBody>
    </>
  );
}
