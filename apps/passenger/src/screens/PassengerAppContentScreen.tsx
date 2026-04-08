import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import type { Order, Passenger } from '@packages/shared';
import { PassengerRegisterScreen } from './PassengerRegisterScreen';
import { PassengerOrdersListScreen } from './PassengerOrdersListScreen';
import { PassengerOrderCreateScreen } from './PassengerOrderCreateScreen';
import { PassengerOrderEditScreen } from './PassengerOrderEditScreen';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';
import { api } from '../api';

function PassengerAppContentScreen() {
  const [screen, setScreen] = useState<
    { name: 'list' } | { name: 'create' } | { name: 'edit'; activeOrder: Order }
  >(() => ({ name: 'list' }));

  const store = useStore();

  // protected zone
  useEffect(() => {
    void (async () => {
      const response = await api.me();
      if (response.ok) store.setCurrentUser(response.data.passenger);
      else store.clearCurrentUser();
    })();
  }, [store.token]);

  const content = !store.currentUser ? <PassengerRegisterScreen /> : <p>{store.currentUser?.name}</p>;

  // const content = !props.token ? (
  //   <PassengerRegisterScreen />
  // ) : screen.name === 'list' ? (
  //   <PassengerOrdersListScreen
  //     token={props.token}
  //     onError={setErrorText}
  //     onUnauthorized={props.onUnauthorized}
  //     onOrdersUpdated={() => { }}
  //     onCreate={() => setScreen({ name: 'create' })}
  //     onOpenOrder={(o: Order) => setScreen({ name: 'edit', activeOrder: o })}
  //   />
  // ) : screen.name === 'create' ? (
  //   <PassengerOrderCreateScreen
  //     onError={setErrorText}
  //     onCreated={() => setScreen({ name: 'list' })}
  //     onCancel={() => setScreen({ name: 'list' })}
  //   />
  // ) : screen.name === 'edit' ? (
  //   <PassengerOrderEditScreen
  //     order={screen.activeOrder}
  //     onError={setErrorText}
  //     onBack={() => setScreen({ name: 'list' })}
  //   />
  // ) : null;

  return (
    <>
      {store.error ? (
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
      ) : null}
      {content}
    </>
  );
}

export default observer(PassengerAppContentScreen);