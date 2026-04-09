import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import type { PassengerOrder } from '@packages/shared';
import PassengerRegisterScreen from './PassengerRegisterScreen';
import PassengerOrdersListScreen from './PassengerOrdersListScreen';
import PassengerOrderCreateScreen from './PassengerOrderCreateScreen';
import PassengerOrderEditScreen from './PassengerOrderEditScreen';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';
import { api } from '../api';
import { socket } from '../socket';

function PassengerAppContentScreen() {

  const store = useStore();
  const [screen, setScreen] = useState<
    | { name: 'list' }
    | { name: 'create' }
    | { name: 'edit'; activeOrder: PassengerOrder }
  >({ name: 'list' });

  // protected zone
  // useEffect(() => {
  //   void (async () => {
  //     const response = await api.me();
  //     if (response.ok) store.setCurrentUser(response.data.passenger);
  //     else store.clearCurrentUser();
  //   })();
  // }, [store.token]);

  // useEffect(() => {
  //   socket.emit('me:request')
  // }, [store.token]);

  // ^^^ это перенесено просто в socket.ts on 'connect' emit 'me:request'
  // TODO убрать api


  const content = !store.currentUser ? (
    <PassengerRegisterScreen />
  ) : screen.name === 'list' ? (
    <PassengerOrdersListScreen
      onCreate={() => setScreen({ name: 'create' })}
      onOpenOrder={(o) => setScreen({ name: 'edit', activeOrder: o })}
    />
  ) : screen.name === 'create' ? (
    <PassengerOrderCreateScreen
      onCreated={() => setScreen({ name: 'list' })}
      onCancel={() => setScreen({ name: 'list' })}
    />
  ) : (
    <PassengerOrderEditScreen
      order={screen.activeOrder}
      onEdited={() => setScreen({ name: 'list' })}
      onDeleted={() => setScreen({ name: 'list' })}
      onCancel={() => setScreen({ name: 'list' })}
    />
  );

  return (
    <>
      {store.error && (
        <Box
          borderWidth="1px"
          borderColor="red.200"
          bg="red.50"
          color="red.800"
          px="3"
          py="2"
          borderRadius="md"
          fontSize="sm"
        >
          {store.error}
        </Box>
      )}
      {store.token && !store.currentUser && (
        <Box
          borderWidth="1px"
          borderColor="red.200"
          bg="red.50"
          color="red.800"
          px="3"
          py="2"
          borderRadius="md"
          fontSize="sm"
        >
          Ваша предыдущая регистрация недействительна. Пожалуйста, зарегистрируйтесь заново.
        </Box>
      )}
      {content}
    </>
  );
}

export default observer(PassengerAppContentScreen);