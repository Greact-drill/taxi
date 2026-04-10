import { observer } from 'mobx-react-lite';
import { Box, Center, VStack } from '@chakra-ui/react';

import DriverAppHeader from './components/DriverAppHeader';
import DriverAppContentScreen from './screens/DriverAppContentScreen';
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
        borderLeftWidth="1px"
        borderRightWidth="1px"
        borderColor="blackAlpha.200"
      >
        <DriverAppHeader />

        <Box as="main" position="relative" flex="1" px="4" py="6">
          <VStack gap="3" align="stretch">
            <DriverAppContentScreen />
          </VStack>

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
