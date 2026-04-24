import { Box, HStack } from '@chakra-ui/react';
import { ContactCard } from '@packages/order-ui';
import { Car } from 'lucide-react';
import type { Driver } from '@packages/shared';

export type OrderDriverRowProps = {
  driver: Driver;
  online: boolean;
};

export function OrderDriverRow({ driver, online }: OrderDriverRowProps) {
  return (
    <HStack bg="purple.50" gap="2.5" align="center" px="3" py="2.5" minW={0}>
      <Box color="purple.600">
        <Car size={18} strokeWidth={2} />
      </Box>
      <Box flex="1" minW={0}>
        <ContactCard title={driver.name} subtitle={driver.car} online={online} />
      </Box>
    </HStack>
  );
}
