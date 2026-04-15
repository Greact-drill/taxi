import { Box, VStack } from '@chakra-ui/react';
import { TransitionEvent } from 'react';
import PassengerRegisterScreen from './PassengerRegisterScreen';
import PassengerOrdersListScreen from './PassengerOrdersListScreen';
import PassengerOrderCreateScreen from './PassengerOrderCreateScreen';
import PassengerOrderEditScreen from './PassengerOrderEditScreen';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';

function PassengerAppContentScreen() {
  const store = useStore();

  const content = !store.currentUser ?
    (
      <Box px="5" py="5">
        <PassengerRegisterScreen />
      </Box>
    ) :
    (
      <Box overflowX="hidden" overflowY="auto" w="100%" flex="1" minH="0">
        <Box
          display="flex"
          h="100%"
          w="200%"
          transform={store.screen === 'form' ? 'translateX(-50%)' : 'translateX(0)'}
          transition="transform 0.3s ease"
          onTransitionEnd={() => store.onScreenTransitionEnd()}
        >
          <Box w="50%" flexShrink={0} px="5" py="5" h="100%" minH="0" display="flex" flexDirection="column">
            <Box flex="1" minH="0">
              <PassengerOrdersListScreen />
            </Box>
          </Box>
          <Box w="50%" flexShrink={0} px="5" py="5" h="100%" minH="0" display="flex" flexDirection="column">
            <Box flex="1" minH="0">
              {store.screenForm === 'new' ? <PassengerOrderCreateScreen /> : <PassengerOrderEditScreen />}
            </Box>
          </Box>
        </Box>
      </Box>
    );

  const alertStack =
    store.error || (store.token && !store.currentUser) ?
      (
        <VStack gap="3" align="stretch" px="5" pt="5">
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
        </VStack>
      ) :
      null;

  return (
    <VStack gap="3" align="stretch" w="100%" h="100%" minH="0" flex="1">
      {alertStack}
      {content}
    </VStack>
  );
}

export default observer(PassengerAppContentScreen);
