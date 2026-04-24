import { Box, HStack } from '@chakra-ui/react';
import type { Passenger } from '@packages/shared';
import { UserRound } from 'lucide-react';
import { ContactCard } from './ContactCard';

export type OrderPassengerRowProps = {
  passenger: Passenger;
  online: boolean;
  /**
   * When `true` (default), stretch to the bottom of a parent card with `p="4"` + `overflow="hidden"`.
   * Set `false` when more content (e.g. buttons) follows inside the same card.
   */
  attachToCardBottom?: boolean;
};

export function OrderPassengerRow({ passenger, online, attachToCardBottom = true }: OrderPassengerRowProps) {
  return (
    <HStack
      bg="blue.50"
      gap="2.5"
      align="center"
      px="3"
      py="1.5"
      minW={0}
      mt="3"
      mx={attachToCardBottom ? '-4' : undefined}
      mb={attachToCardBottom ? '-4' : undefined}
      borderBottomRadius={attachToCardBottom ? 'lg' : 'md'}
    >
      <Box color="blue.600" lineHeight="0" flexShrink={0}>
        <UserRound size={18} strokeWidth={2} />
      </Box>
      <Box flex="1" minW={0}>
        <ContactCard title={passenger.name} subtitle={passenger.phone} online={online} />
      </Box>
    </HStack>
  );
}
