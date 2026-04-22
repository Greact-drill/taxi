import { useEffect } from 'react';
import { socket } from './socket';

import { Box, HStack } from '@chakra-ui/react';

import { DriversColumn } from './columns/DriversColumn';
import { OrdersColumn } from './columns/OrdersColumn';
import { PassengersColumn } from './columns/PassengersColumn';
import { SettingsColumn } from './columns/SettingsColumn';

export default function App() {
  
  useEffect(() => {
    socket.emit('dispatcher:status:map:request');
  }, [socket.id]);

  return (
    <Box h="100dvh" w="100%" overflow="hidden" p="4" display="flex" flexDirection="column" boxSizing="border-box">
      <HStack align="stretch" gap="4" flex="1" minH={0} minW={0} w="100%">
        <SettingsColumn />
        <DriversColumn />
        <PassengersColumn />
        <OrdersColumn />
      </HStack>
    </Box>
  );
}
