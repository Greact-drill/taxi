import { Box, Button, Text, VStack } from '@chakra-ui/react';
import type { Order } from '@packages/shared';

export function OrdersListMode(props: {
  orders: Order[];
  onCreate: () => void;
  onOpenOrder: (order: Order) => void;
}) {
  return (
    <>
      <Text fontSize="lg" fontWeight="semibold">
        Мои заявки
      </Text>

      <Button
        size="lg"
        variant="outline"
        borderStyle="dashed"
        borderWidth="2px"
        py="10"
        onClick={props.onCreate}
      >
        Создать
      </Button>

      <VStack gap="3" align="stretch">
        {props.orders.map((o) => (
          <Box
            key={o.id}
            borderWidth="1px"
            borderColor="blackAlpha.200"
            borderRadius="lg"
            p="4"
            bg="white"
            cursor="pointer"
            onClick={() => props.onOpenOrder(o)}
          >
            <Text fontWeight="semibold" fontSize="sm">
              #{o.id}
            </Text>
            <Text fontSize="sm" color="gray.700" mt="2">
              from: {o.from}
            </Text>
            <Text fontSize="sm" color="gray.700">
              to: {o.to}
            </Text>
            <Text fontSize="xs" color="gray.500" mt="2">
              passengerId: {o.passengerId}
            </Text>
          </Box>
        ))}
      </VStack>
    </>
  );
}

