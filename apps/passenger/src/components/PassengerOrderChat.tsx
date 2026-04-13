import { Button, Input, Text, VStack } from '@chakra-ui/react';
import type { PassengerOrder } from '@packages/shared';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { useStore } from '../store';
import { PassengerOrderChatMessageRow } from './PassengerOrderChatMessageRow';

function PassengerOrderChatComponent() {
  const store = useStore();
  const order = store.screenFormData;
  const [chatDraft, setChatDraft] = useState('');

  useEffect(() => {
    setChatDraft('');
  }, [order]);

  useEffect(() => {
    if (!order.driver) return;
    socket.emit('passenger:order:messages:request', order);
  }, [socket.id, order]);

  const messages = store.screenFormMessages;
  const canSendMessage = chatDraft.trim().length > 0;

  function onSend(): void {
    if (!canSendMessage) return;
    store.clearError();
    socket.emit('passenger:order:messages:send', order, chatDraft);
    setChatDraft('');
  }

  return (
    <VStack gap="2" align="stretch" borderWidth="1px" borderRadius="md" p="3">
      <Text fontWeight="semibold">Чат</Text>
      {messages.map((message) => (
        <PassengerOrderChatMessageRow key={message.id} message={message} />
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

export const PassengerOrderChat = observer(PassengerOrderChatComponent);
