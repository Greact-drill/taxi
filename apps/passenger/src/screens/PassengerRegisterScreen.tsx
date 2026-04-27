import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import type { Passenger } from '@packages/shared';
import { socket } from '../socket';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';

function PassengerRegisterScreen() {
  const store = useStore();
  const [passenger, setPassenger] = useState<Partial<Passenger>>({
    name: '',
    phone: '',
  });

  const isPhoneValid = /^\+?\d+$/.test(passenger.phone!.trim());
  const canSubmit =
    passenger.name!.trim().length > 0 &&
    passenger.phone!.trim().length > 0 &&
    isPhoneValid;
  // TODO validation messages

  async function onRegister(): Promise<void> {
    store.clearError();
    socket.emit('passenger:auth:register', passenger);
  }

  return (
    <Box borderWidth="1px" borderColor="blackAlpha.200" borderRadius="lg" p="4">
      <Text fontSize="lg" fontWeight="semibold">
        Регистрация
      </Text>
      <VStack gap="3" align="stretch" mt="3">
        <Input
          placeholder="Имя"
          value={passenger.name!}
          onChange={(e) =>
            setPassenger({ ...passenger, name: e.target.value })
          }
        />
        <Input
          placeholder="Телефон"
          value={passenger.phone!}
          onChange={(e) =>
            setPassenger({ ...passenger, phone: e.target.value })
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
