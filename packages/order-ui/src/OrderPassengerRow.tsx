import { Box, HStack, Text } from '@chakra-ui/react';
import { UserRound } from 'lucide-react';
import { OrderInlineSeparatorDot } from './OrderInlineSeparatorDot';

export type OrderPassengerRowProps = {
  name: string;
  phone: string;
  /**
   * When `true` (default), stretch to the bottom of a parent card with `p="4"` + `overflow="hidden"`.
   * Set `false` when more content (e.g. buttons) follows inside the same card.
   */
  attachToCardBottom?: boolean;
};

/** Strip for driver app: passenger icon + name + dot + phone in one line (light blue panel). */
export function OrderPassengerRow({ name, phone, attachToCardBottom = true }: OrderPassengerRowProps) {
  const full = `${name} · ${phone}`;

  return (
    <HStack
      gap="2.5"
      align="center"
      bg="blue.50"
      px="3"
      py="2.5"
      mt="3"
      mx={attachToCardBottom ? '-4' : undefined}
      mb={attachToCardBottom ? '-4' : undefined}
      borderBottomRadius={attachToCardBottom ? 'lg' : 'md'}
    >
      <Box color="blue.600" lineHeight="0" flexShrink={0}>
        <UserRound size={18} strokeWidth={2} />
      </Box>
      <HStack gap="1.5" align="center" flex="1" minW={0} title={full}>
        <Text as="span" fontSize="sm" fontWeight="semibold" color="gray.800" truncate>
          {name}
        </Text>
        <OrderInlineSeparatorDot />
        <Text as="span" fontSize="sm" color="gray.600" flex="1" minW={0} truncate>
          {phone}
        </Text>
      </HStack>
    </HStack>
  );
}
