import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import type { Passenger } from '@packages/shared';
import { socket } from '../socket';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';

function PassengerRegisterScreen() {
  const store = useStore();
  const [passenger, setPassenger] = useState<Partial<Passenger>>({});

  const name = (passenger.name ?? '').trim();
  const phone = (passenger.phone ?? '').trim();
  const isPhoneValid = /^\+?\d+$/.test(phone);
  const canSubmit = name.length > 0 && phone.length > 0 && isPhoneValid;
  // TODO validation messages

  async function onRegister(): Promise<void> {
    store.clearError();
    socket.emit('auth:register', passenger);
  }

  return (
    <Box borderWidth="1px" borderColor="blackAlpha.200" borderRadius="lg" p="4">
      <Text fontSize="lg" fontWeight="semibold">
        Регистрация
      </Text>
      <VStack gap="3" align="stretch" mt="3">
        <Input
          placeholder="Имя"
          value={name}
          onChange={(e) =>
            setPassenger((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <Input
          placeholder="Телефон"
          value={phone}
          onChange={(e) =>
            setPassenger((prev) => ({ ...prev, phone: e.target.value }))
          }
        />
        <Button
          onClick={() => void onRegister()}
          size="lg"
          disabled={!canSubmit}
        >
          Зарегистрироваться
        </Button>
      </VStack>
    </Box>
  );
}

export default observer(PassengerRegisterScreen);
