import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { SendHorizontal } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';
import { useStore } from '../store';
import { PassengerOrderChatMessageRow } from './PassengerOrderChatMessageRow';

function PassengerOrderChat() {
  const store = useStore();
  const order = store.screenFormData;
  const [chatDraft, setChatDraft] = useState('');
  const messagesScrollRef = useRef<HTMLDivElement | null>(null);

  const messages = store.screenFormMessages;

  useEffect(() => {
    if (!order.driver) return;
    socket.emit('passenger:order:messages:request', order);
  }, [socket.id, order]);

  useEffect(() => {
    setChatDraft('');
    const messagesContainer = messagesScrollRef.current;
    if (!messagesContainer) return;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages]);

  const canSendMessage = chatDraft.trim().length > 0;

  function onSend(): void {
    if (!canSendMessage) return;
    store.clearError();
    socket.emit('passenger:order:messages:send', order, chatDraft);
    setChatDraft('');
  }

  return (
    <VStack gap="2" align="stretch" flex="1" minH="0">
      <Text fontWeight="semibold">Чат с водителем</Text>
      <VStack
        gap="2"
        align="stretch"
        borderWidth="1px"
        borderRadius="md"
        p="3"
        bg="blue.100"
        boxShadow="inset 0 3px 14px rgba(0, 0, 0, 0.1), inset 0 1px 4px rgba(0, 0, 0, 0.06)"
        flex="1"
        minH="0"
      >
        <Box ref={messagesScrollRef} flex="1" minH="0" overflowY="auto" pr="1">
          <VStack gap="2" align="stretch" justify="flex-end" minH="full">
            {messages.map((message) => (
              <PassengerOrderChatMessageRow key={message.id} message={message} />
            ))}
          </VStack>
        </Box>
        <HStack gap="2" align="stretch">
          <Input
            placeholder="Сообщение"
            bg="white"
            value={chatDraft}
            onChange={(e) => setChatDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSend();
            }}
          />
          <Button onClick={onSend} disabled={!canSendMessage} w="10" h="10" p="0" aria-label="Отправить">
            <SendHorizontal size={18} aria-hidden />
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
}

export default observer(PassengerOrderChat);
