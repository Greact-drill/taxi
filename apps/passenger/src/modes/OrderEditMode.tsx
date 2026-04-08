import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';
import type { Order } from '@packages/shared';

export function OrderEditMode(props: {
  order: Order;
  from: string;
  to: string;
  onChangeFrom: (v: string) => void;
  onChangeTo: (v: string) => void;
  onSubmit: () => void;
  onDelete: () => void;
  onBack: () => void;
}) {
  return (
    <Box borderWidth="1px" borderColor="blackAlpha.200" borderRadius="lg" p="4" bg="white">
      <Text fontSize="lg" fontWeight="semibold">
        Заявка #{props.order.id}
      </Text>
      <VStack gap="3" align="stretch" mt="3">
        <Input placeholder="Откуда" value={props.from} onChange={(e) => props.onChangeFrom(e.target.value)} />
        <Input placeholder="Куда" value={props.to} onChange={(e) => props.onChangeTo(e.target.value)} />
        <Button size="lg" onClick={props.onSubmit}>
          Сохранить
        </Button>
        <Button colorPalette="red" variant="outline" onClick={props.onDelete}>
          Удалить
        </Button>
        <Button variant="ghost" onClick={props.onBack}>
          Назад
        </Button>
      </VStack>
    </Box>
  );
}

