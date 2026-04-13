import { Box } from '@chakra-ui/react';
import type { OrderChatMessage } from '@packages/shared';

export type DriverOrderChatMessageRowProps = {
  message: OrderChatMessage;
};

export function DriverOrderChatMessageRow({ message }: DriverOrderChatMessageRowProps) {
  return (
    <Box fontSize="sm">
      {message.authorRole}: {message.text}
    </Box>
  );
}
