import { Box, HStack, Text } from '@chakra-ui/react';
import type { Passenger } from '@packages/shared';

import { ContactCard } from './ContactCard';

export type PassengerAppHeaderProps = {
  passenger: Passenger;
  online: boolean;
};

export function PassengerAppHeader({ passenger, online }: PassengerAppHeaderProps) {
  return (
    <HStack gap="2.5" align="center" px="3" py="2.5" minW={0}>
      <Text fontSize="sm" fontWeight="bold" color="blue.600">
        #{passenger.id}
      </Text>
      <Box flex="1" minW={0}>
        <ContactCard title={passenger.name} subtitle={passenger.phone} online={online} />
      </Box>
    </HStack>
  );
}
