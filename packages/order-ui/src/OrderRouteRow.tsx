import { Box, HStack, Text } from '@chakra-ui/react';
import { ArrowRight, MapPin } from 'lucide-react';

export type OrderRouteRowProps = {
  from: string;
  to: string;
};

export function OrderRouteRow({ from, to }: OrderRouteRowProps) {
  return (
    <HStack gap="2" align="flex-start" mt="3">
      <Box color="gray.400" lineHeight="0" mt="0.5" flexShrink={0} aria-hidden>
        <MapPin size={16} strokeWidth={2} />
      </Box>
      <HStack gap="1.5" align="center" flex="1" minW="0" flexWrap="wrap">
        <Text fontSize="sm" color="gray.700">
          {from}
        </Text>
        <Box color="gray.400" lineHeight="0" flexShrink={0} aria-hidden>
          <ArrowRight size={14} strokeWidth={2} />
        </Box>
        <Text fontSize="sm" color="gray.700">
          {to}
        </Text>
      </HStack>
    </HStack>
  );
}
