import { Button, Input, VStack } from '@chakra-ui/react';
import type { DriverOrder } from '@packages/shared';
import { OrderStatus } from '@packages/shared';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { useStore } from '../store';
import { DriverOrderChatMessageRow } from './DriverOrderChatMessageRow';

function DriverOrderChatComponent() {
  const store = useStore();
  const order = store.screenFormData;
  const [chatDraft, setChatDraft] = useState('');

  useEffect(() => {
    setChatDraft('');
  }, [order]);

  useEffect(() => {
    socket.emit('driver:order:messages:request', order);
  }, [socket.id, order]);

  const messages = store.screenFormMessages;
  const canSendMessage = chatDraft.trim().length > 0;

  function onSend(): void {
    if (!canSendMessage) return;
    store.clearError();
    socket.emit('driver:order:messages:send', order, chatDraft);
    setChatDraft('');
  }

  return (
    <VStack gap="2" align="stretch" borderWidth="1px" borderRadius="md" p="3">
      {messages.map((message) => (
        <DriverOrderChatMessageRow key={message.id} message={message} />
      ))}
      <Input
        placeholder="Сообщение"
        value={chatDraft}
        onChange={(e) => setChatDraft(e.target.value)}
      />
      <Button onClick={onSend} disabled={!canSendMessage}>
        Отправить
      </Button>
    </VStack>
  );
}

export const DriverOrderChat = observer(DriverOrderChatComponent);
