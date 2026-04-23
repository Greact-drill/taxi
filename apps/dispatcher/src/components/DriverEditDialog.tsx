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
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { Driver } from '@packages/shared';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { store } from '../store';

function generatePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]!).join('');
}

export type DriverEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: Driver | null;
};

export function DriverEditDialog(props: DriverEditDialogProps) {
  const [draft, setDraft] = useState<Driver | null>(null);
  const [passwordMode, setPasswordMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!props.open) {
      setDraft(null);
      setPasswordMode(false);
      setNewPassword('');
      return;
    }
    if (props.driver) {
      setDraft({ ...props.driver });
      setPasswordMode(false);
      setNewPassword('');
    }
  }, [props.open, props.driver]);

  const login = (draft?.login ?? '').trim();
  const name = (draft?.name ?? '').trim();
  const car = (draft?.car ?? '').trim();
  const canSave = login.length > 0 && name.length > 0 && car.length > 0;
  const canSubmitPassword = newPassword.trim().length > 0;

  function onSave(): void {
    if (!draft) return;
    store.clearError();
    socket.emit('dispatcher:drivers:update', draft.id, draft);
    props.onOpenChange(false);
  }

  function onDelete(): void {
    if (!draft) return;
    store.clearError();
    socket.emit('dispatcher:drivers:delete', draft.id);
    props.onOpenChange(false);
  }

  function onPasswordCommit(): void {
    if (!draft) return;
    store.clearError();
    const pwd = newPassword.trim();
    if (!pwd) return;
    socket.emit('dispatcher:drivers:password', draft.id, pwd);
    setPasswordMode(false);
    setNewPassword('');
  }

  function onGeneratePassword(): void {
    setNewPassword(generatePassword());
  }

  function onCopyCreds(): void {
    if (!draft) return;
    const pwd = newPassword.trim();
    const l = draft.login.trim();
    const text = `Добрый день! Данные для входа: логин ${l}, пароль ${pwd}. Не передавайте их посторонним.`;
    void navigator.clipboard.writeText(text);
  }

  return (
    <DialogRoot
      open={props.open}
      onOpenChange={(d) => {
        if (!d.open) {
          setDraft(null);
          setPasswordMode(false);
          setNewPassword('');
        }
        props.onOpenChange(d.open);
      }}
      size="sm"
    >
      <Portal>
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
                  {draft ? `Водитель #${draft.id}` : props.driver ? `Водитель #${props.driver.id}` : 'Водитель'}
                </DialogTitle>
                <DialogCloseTrigger />
              </HStack>
            </DialogHeader>
            <DialogBody>
              {draft &&
                (passwordMode ? (
                  <VStack gap="3" align="stretch">
                    <Text fontSize="sm" color="gray.700">
                      Сессия водителя в приложении будет завершена; для работы потребуется повторный вход с новым
                      паролем.
                    </Text>
                    <Input
                      placeholder="Новый пароль"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <HStack gap="2" flexWrap="wrap" justify="space-between">
                      <Button variant="outline" size="sm" onClick={onGeneratePassword}>
                        🎲 Случайный
                      </Button>
                      <Button variant="outline" size="sm" onClick={onCopyCreds} disabled={!newPassword.trim()}>
                        📋 Скопировать для отправки
                      </Button>
                    </HStack>
                    <Button
                      size="md"
                      colorPalette="red"
                      onClick={onPasswordCommit}
                      disabled={!canSubmitPassword}
                    >
                      Установить пароль
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPasswordMode(false);
                        setNewPassword('');
                      }}
                    >
                      Назад
                    </Button>
                  </VStack>
                ) : (
                  <VStack gap="3" align="stretch">
                    <Input
                      placeholder="Логин"
                      value={draft.login}
                      onChange={(e) => setDraft({ ...draft, login: e.target.value })}
                    />
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
                    <HStack gap="2" flexWrap="wrap" justify="space-between" align="center">
                      <Text fontSize="sm" color="gray.500">
                        Редактирование учётной записи
                      </Text>
                    </HStack>
                    <VStack align="stretch" gap="2">
                      <Button onClick={onSave} disabled={!canSave}>
                        Сохранить
                      </Button>
                      <Button
                        colorPalette="red"
                        variant="outline"
                        onClick={() => setPasswordMode(true)}
                      >
                        Сменить пароль
                      </Button>
                      <Button colorPalette="red" variant="outline" onClick={onDelete}>
                        Удалить
                      </Button>
                    </VStack>
                  </VStack>
                ))}
            </DialogBody>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
}
