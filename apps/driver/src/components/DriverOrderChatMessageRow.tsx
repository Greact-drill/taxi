import { Box, Text, VStack } from '@chakra-ui/react';
import type { OrderChatMessage } from '@packages/shared';

export type DriverOrderChatMessageRowProps = {
  message: OrderChatMessage;
};

export function DriverOrderChatMessageRow({ message }: DriverOrderChatMessageRowProps) {
  const isDriver = message.authorRole === 'driver';
  const messageTime = new Date(message.createdAt).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <VStack align={isDriver ? 'end' : 'start'} gap="0.5">
      <Box
        maxW="85%"
        px="3"
        py="2"
        borderRadius="xl"
        bg={isDriver ? 'purple.50' : 'white'}
        color="gray.900"
        alignSelf={isDriver ? 'end' : 'start'}
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
