import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import type { Order, Passenger } from '@packages/shared';
import { PassengerRegisterScreen } from './PassengerRegisterScreen';
import { PassengerOrdersListScreen } from './PassengerOrdersListScreen';
import { PassengerOrderCreateScreen } from './PassengerOrderCreateScreen';
import { PassengerOrderEditScreen } from './PassengerOrderEditScreen';

export function PassengerAppContentScreen(props: {
  token: string | null;
  onRegistered: (nextToken: string, nextPassenger: Passenger) => void;
  onUnauthorized: () => void;
}) {
  const [screen, setScreen] = useState<
    { name: 'list' } | { name: 'create' } | { name: 'edit'; activeOrder: Order }
  >(() => ({ name: 'list' }));
  const [errorText, setErrorText] = useState<string | null>(null);

  const content = !props.token ? (
    <PassengerRegisterScreen onError={setErrorText} onRegistered={props.onRegistered} />
  ) : screen.name === 'list' ? (
    <PassengerOrdersListScreen
      token={props.token}
      onError={setErrorText}
      onUnauthorized={props.onUnauthorized}
      onOrdersUpdated={() => {}}
      onCreate={() => setScreen({ name: 'create' })}
      onOpenOrder={(o: Order) => setScreen({ name: 'edit', activeOrder: o })}
    />
  ) : screen.name === 'create' ? (
    <PassengerOrderCreateScreen
      onError={setErrorText}
      onCreated={() => setScreen({ name: 'list' })}
      onCancel={() => setScreen({ name: 'list' })}
    />
  ) : screen.name === 'edit' ? (
    <PassengerOrderEditScreen
      order={screen.activeOrder}
      onError={setErrorText}
      onBack={() => setScreen({ name: 'list' })}
    />
  ) : null;

  return (
    <>
      {errorText ? (
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
          {errorText}
        </Box>
      ) : null}
      {content}
    </>
  );
}

