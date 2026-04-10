import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import PassengerRegisterScreen from './PassengerRegisterScreen';
import PassengerOrdersListScreen from './PassengerOrdersListScreen';
import PassengerOrderCreateScreen from './PassengerOrderCreateScreen';
import PassengerOrderEditScreen from './PassengerOrderEditScreen';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';
import { socket } from '../socket';


function PassengerAppContentScreen() {
  const store = useStore();
  
  const ordersBlock = (
    <Box overflow="hidden" w="100%">
      <Box
        display="flex"
        w="200%"
        transform={store.screen === 'form' ? 'translateX(-50%)' : 'translateX(0)'}
        transition="transform 0.3s ease"
      >
        <Box w="50%" flexShrink={0}>
          <PassengerOrdersListScreen />
        </Box>
        <Box w="50%" flexShrink={0}>
          {store.screenForm === 'new' ? <PassengerOrderCreateScreen /> : <PassengerOrderEditScreen />}
        </Box>
      </Box>
    </Box>
  );

  const content = !store.currentUser ? <PassengerRegisterScreen /> : ordersBlock;

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
