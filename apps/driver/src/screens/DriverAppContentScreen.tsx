import { Box, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import DriverLoginScreen from './DriverLoginScreen';
import DriverOrdersListScreen from './DriverOrdersListScreen';
import DriverOrderFormScreen from './DriverOrderFormScreen';
import { useStore } from '../store';

function DriverAppContentScreen() {
  const store = useStore();

  return (
    <VStack gap="3" align="stretch" w="100%" flex="1" minH="0">
      {store.error || (store.token && !store.currentUser) ? (
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
              Сессия недействительна. Войдите снова.
            </Box>
          )}
        </VStack>
      ) : null}

      {!store.currentUser ? (
        <Box px="5" py="5" flexShrink={0}>
          <DriverLoginScreen />
        </Box>
      ) : (
        <Box
          overflow="hidden"
          w="100%"
          flex="1"
          minH="0"
          display="flex"
          flexDirection="column"
        >
          <Box
            display="flex"
            w="200%"
            flex="1"
            minH="0"
            alignItems="stretch"
            transform={store.screen === 'form' ? 'translateX(-50%)' : 'translateX(0)'}
            transition="transform 0.3s ease"
            onTransitionEnd={() => store.onScreenTransitionEnd()}
          >
            <Box
              w="50%"
              flexShrink={0}
              flex="1"
              minH="0"
              px="5"
              py="5"
              display="flex"
              flexDirection="column"
            >
              <DriverOrdersListScreen />
            </Box>
            <Box
              w="50%"
              flexShrink={0}
              flex="1"
              minH="0"
              px="5"
              py="5"
              display="flex"
              flexDirection="column"
            >
              <DriverOrderFormScreen />
            </Box>
          </Box>
        </Box>
      )}
    </VStack>
  );
}

export default observer(DriverAppContentScreen);
