import { Box, HStack, Text } from '@chakra-ui/react';
import { Car } from 'lucide-react';
import { OrderInlineSeparatorDot } from './OrderInlineSeparatorDot';

export type OrderDriverRowProps = {
  name: string;
  car: string;
  /**
   * When `true` (default), stretch to the bottom of a parent card with `p="4"` + `overflow="hidden"`.
   * Set `false` when more content follows inside the same card.
   */
  attachToCardBottom?: boolean;
};

/** Strip for passenger app: car icon + name + dot + car in one line (light purple panel). */
export function OrderDriverRow({ name, car, attachToCardBottom = true }: OrderDriverRowProps) {
  const full = `${name} · ${car}`;

  return (
    <HStack
      gap="2.5"
      align="center"
      bg="purple.50"
      px="3"
      py="2.5"
      mt="3"
      mx={attachToCardBottom ? '-4' : undefined}
      mb={attachToCardBottom ? '-4' : undefined}
      borderBottomRadius={attachToCardBottom ? 'lg' : 'md'}
    >
      <Box color="purple.600" lineHeight="0" flexShrink={0}>
        <Car size={18} strokeWidth={2} />
      </Box>
      <HStack gap="1.5" align="center" flex="1" minW={0} title={full}>
        <Text as="span" fontSize="sm" fontWeight="semibold" color="gray.800" truncate>
          {name}
        </Text>
        <OrderInlineSeparatorDot />
        <Text as="span" fontSize="sm" color="gray.600" flex="1" minW={0} truncate>
          {car}
        </Text>
      </HStack>
    </HStack>
  );
}
