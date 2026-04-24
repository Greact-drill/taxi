import { useEffect } from 'react';
import { socket } from './socket';

import { Box, HStack } from '@chakra-ui/react';

import SettingsColumn from './columns/SettingsColumn';
import DriversColumn from './columns/DriversColumn';
import PassengersColumn from './columns/PassengersColumn';
import OrdersColumn from './columns/OrdersColumn';

import FormDialogRoot from './components/FormDialogRoot';

import { store } from './store';
import { observer } from 'mobx-react-lite';

function App() {
  const { error } = store;

  useEffect(() => {
    socket.emit('dispatcher:status:map:request');
  }, [socket.id]);

  return (
    <Box h="100dvh" w="100%" overflow="hidden" p="4" display="flex" flexDirection="column" boxSizing="border-box" gap="4" >
      {error && (
        <Box px="3" py="2" borderWidth="1px" borderColor="red.200" bg="red.50" color="red.800" borderRadius="md" fontSize="sm">
          {error}
        </Box>
      )}
      <HStack align="stretch" gap="4" flex="1" minH={0} minW={0} w="100%">
        <SettingsColumn />
        <DriversColumn />
        <PassengersColumn />
        <OrdersColumn />
      </HStack>      
      <FormDialogRoot />
    </Box>
  );
}

export default observer(App);
