import { useEffect } from 'react';
import { Box, Flex, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { socket } from '../socket';

import DriverOrderPreview from '../components/DriverOrderPreview';
import DriverActiveOrdersListScreen from './DriverActiveOrdersListScreen';

function DriverOrdersListScreen() {
  const store = useStore();

  useEffect(() => {
    socket.emit('driver:orders:active:request');
    socket.emit('driver:orders:request');
    socket.emit('driver:status:map:request');
  }, [socket.id]);

  const hasAssigned = store.assignedOrders.length > 0;

  return (
    <Flex direction="column" flex="1" minH="0" align="stretch" gap="4">
      {hasAssigned && (
        <VStack gap="3" align="stretch" flexShrink={0}>
          {store.assignedOrders.map((order) => (
            <DriverOrderPreview
              key={order.id}
              order={order}
              onClick={() => store.openOrderForm(order)}
            />
          ))}
        </VStack>
      )}

      <Box flex="1" minH="0" display="flex" flexDirection="column">
        <DriverActiveOrdersListScreen />
      </Box>
    </Flex>
  );
}

export default observer(DriverOrdersListScreen);
