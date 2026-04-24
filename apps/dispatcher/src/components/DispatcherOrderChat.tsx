import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { SendHorizontal } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';
import { useStore } from '../store';
import { DispatcherOrderChatMessageRow } from './DispatcherOrderChatMessageRow';

type DispatcherOrderChatProps = {
  orderId: number;
};

function DispatcherOrderChat(props: DispatcherOrderChatProps) {
  const store = useStore();
  const [chatDraft, setChatDraft] = useState('');
  const messagesScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.emit('dispatcher:order:messages:request', props.orderId);
  }, [socket.id, props.orderId]);

  const messages = store.screenFormMessages;

  useEffect(() => {
    const messagesContainer = messagesScrollRef.current;
    if (!messagesContainer) return;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages]);

  const canSendMessage = chatDraft.trim().length > 0;

  function onSend(): void {
    if (!canSendMessage) return;
    store.clearError();
    socket.emit('dispatcher:order:messages:send', props.orderId, chatDraft);
    setChatDraft('');
  }

  return (
    <Box display="flex" flexDirection="column" flex="1" minH="0" minW="0" h="full" w="full" gap="2">
      <Text flexShrink={0}>Чат по заявке</Text>
      <VStack
        gap="2"
        align="stretch"
        borderWidth="1px"
        borderRadius="md"
        p="3"
        bg="colorPalette.muted"
        boxShadow="inset 0 3px 14px rgba(0, 0, 0, 0.1), inset 0 1px 4px rgba(0, 0, 0, 0.06)"
        flex="1"
        minH="0"
        overflow="hidden"
      >
        <Box ref={messagesScrollRef} flex="1" minH="0" overflowY="auto" pr="1">
          <VStack gap="2" align="stretch" justify="flex-end" minH="full">
            {messages.map((message) => (
              <DispatcherOrderChatMessageRow key={message.id} message={message} />
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
    </Box>
  );
}

export default observer(DispatcherOrderChat);
