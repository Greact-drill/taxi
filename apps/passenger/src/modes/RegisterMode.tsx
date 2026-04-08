import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';
import type { Passenger } from '@packages/shared';

export function RegisterMode(props: {
  value: Partial<Passenger>;
  onChange: (patch: Partial<Passenger>) => void;
  onSubmit: () => void;
}) {
  const name = props.value.name ?? '';
  const phone = props.value.phone ?? '';
  const canSubmit = name.trim().length > 0 && phone.trim().length > 0;

  return (
    <Box borderWidth="1px" borderColor="blackAlpha.200" borderRadius="lg" p="4">
      <Text fontSize="lg" fontWeight="semibold">
        Регистрация
      </Text>
      <VStack gap="3" align="stretch" mt="3">
        <Input
          placeholder="Имя"
          value={name}
          onChange={(e) => props.onChange({ name: e.target.value })}
        />
        <Input
          placeholder="Телефон"
          value={phone}
          onChange={(e) => props.onChange({ phone: e.target.value })}
        />
        <Button onClick={props.onSubmit} size="lg" disabled={!canSubmit}>
          Зарегистрироваться
        </Button>
      </VStack>
    </Box>
  );
}

