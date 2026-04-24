import { Box, HStack, Text } from '@chakra-ui/react';
import type { Driver } from '@packages/shared';
import { ContactCard } from './ContactCard';

export type DriverAppHeaderProps = {
  driver: Driver;
  online: boolean;
};

export function DriverAppHeader({ driver, online }: DriverAppHeaderProps) {
  return (
    <HStack gap="2.5" align="center" px="3" py="2.5" minW={0}>
      <Text fontSize="sm" fontWeight="bold" color="purple.600">
        #{driver.id}
      </Text>
      <Box flex="1" minW={0}>
        <ContactCard title={driver.name} subtitle={driver.car} online={online} />
      </Box>
    </HStack>
  );
}
