import { observer } from 'mobx-react-lite';
import { Box, Center } from '@chakra-ui/react';

import PassengerAppHeader from './components/PassengerAppHeader';
import PassengerAppContentScreen from './screens/PassengerAppContentScreen';
import { store } from './store';

function App() {
  return (
    <Box bg="gray.50" minH="100dvh">
      <Box
        bg="white"
        minH="100dvh"
        maxW="420px"
        mx="auto"
        display="flex"
        flexDirection="column"
      >
        <PassengerAppHeader />

        <Box as="main" position="relative" flex="1">
          <PassengerAppContentScreen />

          {!store.online && (
            <Center
              position="absolute"
              inset="0"
              bg="blackAlpha.400"
              color="white"
              textAlign="center"
              px="6"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default observer(App);
