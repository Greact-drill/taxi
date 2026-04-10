import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import type { DriverOrder } from '@packages/shared';
import { DriverOrderStatusBadge } from './DriverOrderStatusBadge';

export type DriverOrderPreviewProps = {
  order: DriverOrder;
  onClick: () => void;
};

export function DriverOrderPreview({ order, onClick }: DriverOrderPreviewProps) {
  const assigned = order.assignedAt ? new Date(order.assignedAt) : undefined;
  const { passenger } = order;

  return (
    <Box
      borderWidth="1px"
      borderColor="blue.100"
      borderRadius="lg"
      p="4"
      bg="blue.50"
      cursor="pointer"
      onClick={onClick}
    >
      <HStack gap="2" align="flex-start" justify="space-between">
        <Text fontWeight="bold" fontSize="sm" color="blue.900">
          Заявка #{order.id}
        </Text>
        <DriverOrderStatusBadge status={order.status} />
      </HStack>
      <VStack align="stretch" gap="1" mt="2">
        <Text fontSize="xs" color="gray.600">
          Пассажир:{' '}
          <Text as="span" fontWeight="medium" color="gray.800">
            {passenger.name}
          </Text>
          {' · '}
          {passenger.phone}
        </Text>
        <Text fontSize="xs" color="gray.500">
          Назначен: {assigned?.toLocaleDateString()} {assigned?.toLocaleTimeString()}
        </Text>
        <Box borderTopWidth="1px" borderColor="blue.100" pt="2" mt="1">
          <Text fontSize="sm" color="gray.800">
            {order.from}
          </Text>
          <Text fontSize="xs" color="gray.500" mt="0.5">
            → {order.to}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
