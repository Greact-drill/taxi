import { HStack, Text, VStack } from '@chakra-ui/react';
import { OrderNetworkStatusBadge } from '@packages/order-ui';

export type ContactCardProps = {
  title: string;
  subtitle: string;
  online: boolean;
};

export function ContactCard({ title, subtitle, online }: ContactCardProps) {
  return (
    <HStack align="center" gap="3" minW={0} justify="space-between">
      <VStack align="stretch" gap="0" flex="1" minW={0}>
        <Text fontSize="sm" fontWeight="semibold" color="gray.800" truncate>
          {title}
        </Text>
        <Text fontSize="sm" color="gray.600" truncate>
          {subtitle}
        </Text>
      </VStack>
      <OrderNetworkStatusBadge online={online} />
    </HStack>
  );
}
