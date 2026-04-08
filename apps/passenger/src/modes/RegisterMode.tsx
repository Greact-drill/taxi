import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';

export function RegisterMode(props: {
  name: string;
  phone: string;
  onChangeName: (v: string) => void;
  onChangePhone: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Box borderWidth="1px" borderColor="blackAlpha.200" borderRadius="lg" p="4">
      <Text fontSize="lg" fontWeight="semibold">
        Регистрация
      </Text>
      <VStack gap="3" align="stretch" mt="3">
        <Input placeholder="Имя" value={props.name} onChange={(e) => props.onChangeName(e.target.value)} />
        <Input
          placeholder="Телефон"
          value={props.phone}
          onChange={(e) => props.onChangePhone(e.target.value)}
        />
        <Button onClick={props.onSubmit} size="lg">
          Зарегистрироваться
        </Button>
      </VStack>
    </Box>
  );
}

