import { Box } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import DriverLoginScreen from './DriverLoginScreen';
import DriverOrdersListScreen from './DriverOrdersListScreen';
import DriverOrderFormScreen from './DriverOrderFormScreen';
import { useStore } from '../store';

function DriverAppContentScreen() {
  const store = useStore();

  const content = !store.currentUser ? (
    <DriverLoginScreen />
  ) : (
    <Box overflow="hidden" w="100%">
      <Box
        display="flex"
        w="200%"
        transform={store.screen === 'form' ? 'translateX(-50%)' : 'translateX(0)'}
        transition="transform 0.3s ease"
      >
        <Box w="50%" flexShrink={0}>
          <DriverOrdersListScreen />
        </Box>
        <Box w="50%" flexShrink={0}>
          <DriverOrderFormScreen />
        </Box>
      </Box>
    </Box>
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
          Сессия недействительна. Войдите снова.
        </Box>
      )}
      {content}
    </>
  );
}

export default observer(DriverAppContentScreen);
