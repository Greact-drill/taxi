import { Box, Text, VStack } from '@chakra-ui/react';
import { ChatAuthorRole, type OrderChatMessage } from '@packages/shared';

export type DispatcherOrderChatMessageRowProps = {
  message: OrderChatMessage;
};

export function DispatcherOrderChatMessageRow({ message }: DispatcherOrderChatMessageRowProps) {
  const isPassenger = message.authorRole === ChatAuthorRole.PASSENGER;
  const isDispatcher = message.authorRole === ChatAuthorRole.DISPATCHER;
  const alignEnd = message.authorRole === ChatAuthorRole.DRIVER || isDispatcher;

  const messageTime = new Date(message.createdAt).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const bubbleBg = isPassenger ? 'white' : isDispatcher ? 'teal.subtle' : 'colorPalette.subtle';

  return (
    <VStack align={alignEnd ? 'end' : 'start'} gap="0.5">
      <Box
        maxW="85%"
        px="3"
        py="2"
        borderRadius="xl"
        bg={bubbleBg}
        color="gray.900"
        alignSelf={alignEnd ? 'end' : 'start'}
      >
        <Text fontSize="sm" lineHeight="1.35">
          {message.text}
        </Text>
        <Text fontSize="2xs" opacity={0.75} mt="1" textAlign="right">
          {messageTime}
        </Text>
      </Box>
    </VStack>
  );
}
