import { observer } from 'mobx-react-lite';
import { Box, Center } from '@chakra-ui/react';

import DriverAppHeader from './components/DriverAppHeader';
import DriverAppContentScreen from './screens/DriverAppContentScreen';
import { store } from './store';

function App() {
  return (
    <Box
      bg="white"
      h="100dvh"
      maxW="420px"
      mx="auto"
      display="flex"
      flexDirection="column"
    >
      <DriverAppHeader />

      <Box
        as="main"
        position="relative"
        flex="1"
        minH="0"
        display="flex"
        flexDirection="column"
      >
        <DriverAppContentScreen />

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
  );
}

export default observer(App);
