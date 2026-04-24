import { observer } from 'mobx-react-lite';
import { Box, Center, HStack } from '@chakra-ui/react';
import { AppHeader, DriverAppHeader, OrderNetworkStatusBadge } from '@packages/order-ui';
// import { ScreenResolutionInfo } from '@packages/order-ui';

import DriverAppMenu from './components/DriverAppMenu';
import DriverAppContentScreen from './screens/DriverAppContentScreen';
import { useStore } from './store';

function App() {
  const store = useStore();

  return (
    <Box
      bg="white"
      h="100dvh"
      maxW="420px"
      mx="auto"
      display="flex"
      flexDirection="column"
    >
      <AppHeader>
        {store.currentUser ? (
          <>
            <DriverAppHeader driver={store.currentUser} online={store.online} />
            <DriverAppMenu />
          </>
        ) : (
          <>
            <OrderNetworkStatusBadge online={store.online} />
            <DriverAppMenu />
          </>
        )}
      </AppHeader>

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
      {/* <ScreenResolutionInfo /> */}
    </Box>
  );
}

export default observer(App);
