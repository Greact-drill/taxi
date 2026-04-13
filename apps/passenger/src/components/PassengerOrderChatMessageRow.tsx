import { Text } from '@chakra-ui/react';
import type { OrderChatMessage } from '@packages/shared';

export type PassengerOrderChatMessageRowProps = {
  message: OrderChatMessage;
};

export function PassengerOrderChatMessageRow({ message }: PassengerOrderChatMessageRowProps) {
  return (
    <Text fontSize="sm">
      {message.authorRole}: {message.text}
    </Text>
  );
}
