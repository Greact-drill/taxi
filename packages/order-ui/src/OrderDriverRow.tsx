import { Box, HStack } from '@chakra-ui/react';
import type { Driver } from '@packages/shared';
import { Car } from 'lucide-react';
import { ContactCard } from './ContactCard';

export type OrderDriverRowProps = {
  driver: Driver;
  online: boolean;
  /**
   * When `true` (default), stretch to the bottom of a parent card with `p="4"` + `overflow="hidden"`.
   * Set `false` when more content follows inside the same card.
   */
  mx?: string;
  mb?: string;
};

export function OrderDriverRow({ driver, online, mx, mb }: OrderDriverRowProps) {
  return (
    <HStack
      gap="2.5"
      align="center"
      bg="purple.50"
      px="3"
      py="1.5"
      minW={0}
      mx={mx}
      mb={mb}
      borderBottomRadius={mb ? 'lg' : 'md'}
    >
      <Box color="purple.600" lineHeight="0" flexShrink={0}>
        <Car size={18} strokeWidth={2} />
      </Box>
      <Box flex="1" minW={0}>
        <ContactCard title={driver.name} subtitle={driver.car} online={online} />
      </Box>
    </HStack>
  );
}
