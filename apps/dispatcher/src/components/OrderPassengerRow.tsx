import { Box, HStack } from '@chakra-ui/react';
import { ContactCard } from '@packages/order-ui';
import { UserRound } from 'lucide-react';
import type { Passenger } from '@packages/shared';

export type OrderPassengerRowProps = {
  passenger: Passenger;
  online: boolean;
};

export function OrderPassengerRow({ passenger, online }: OrderPassengerRowProps) {
  return (
    <HStack bg="blue.50" gap="2.5" align="center" px="3" py="2.5" minW={0}>
      <Box color="blue.600">
        <UserRound size={18} strokeWidth={2} />
      </Box>
      <Box flex="1" minW={0}>
        <ContactCard title={passenger.name} subtitle={passenger.phone} online={online} />
      </Box>
    </HStack>
  );
}
