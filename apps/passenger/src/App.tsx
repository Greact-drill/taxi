import { observer } from 'mobx-react-lite';
import { Box, Center } from '@chakra-ui/react';
import { AppHeader, OrderNetworkStatusBadge, PassengerAppHeader, ScreenResolutionInfo } from '@packages/order-ui';

import PassengerAppMenu from './components/PassengerAppMenu';
import PassengerAppContentScreen from './screens/PassengerAppContentScreen';
import { store } from './store';

function App() {
  return (
    <Box
      bg="white"
      h="100dvh"
      maxW="400px"
      mx="auto"
      display="flex"
      flexDirection="column"
    >
      <AppHeader>
        {store.currentUser ? (
          <>
            <PassengerAppHeader passenger={store.currentUser} online={store.online} />
            <PassengerAppMenu />
          </>
        ) : (
          <>
            <OrderNetworkStatusBadge online={store.online} />
            <PassengerAppMenu />
          </>
        )}
      </AppHeader>

      <Box as="main" position="relative" flex="1" display="flex" minH="0">
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
      <ScreenResolutionInfo />
    </Box>
  );
}

export default observer(App);
