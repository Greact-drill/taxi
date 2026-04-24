import { Box, Text, VStack } from '@chakra-ui/react';
import type { OrderChatMessage } from '@packages/shared';

export type PassengerOrderChatMessageRowProps = {
  message: OrderChatMessage;
};

export function PassengerOrderChatMessageRow({ message }: PassengerOrderChatMessageRowProps) {
  const isPassenger = message.authorRole === 'passenger';
  const messageTime = new Date(message.createdAt).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <VStack align={isPassenger ? 'end' : 'start'} gap="0.5">
      <Box
        maxW="85%"
        px="3"
        py="2"
        borderRadius="xl"
        bg={isPassenger ? 'colorPalette.subtle' : 'white'}
        alignSelf={isPassenger ? 'end' : 'start'}
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
