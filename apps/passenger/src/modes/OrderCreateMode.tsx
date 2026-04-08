import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';

export function OrderCreateMode(props: {
  from: string;
  to: string;
  onChangeFrom: (v: string) => void;
  onChangeTo: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  return (
    <Box borderWidth="1px" borderColor="blackAlpha.200" borderRadius="lg" p="4" bg="white">
      <Text fontSize="lg" fontWeight="semibold">
        Новая заявка
      </Text>
      <VStack gap="3" align="stretch" mt="3">
        <Input placeholder="Откуда" value={props.from} onChange={(e) => props.onChangeFrom(e.target.value)} />
        <Input placeholder="Куда" value={props.to} onChange={(e) => props.onChangeTo(e.target.value)} />
        <Button size="lg" onClick={props.onSubmit}>
          Создать
        </Button>
        <Button variant="ghost" onClick={props.onCancel}>
          Отмена
        </Button>
      </VStack>
    </Box>
  );
}

