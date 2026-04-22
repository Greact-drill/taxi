import { useEffect } from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';
import { OrderNetworkStatusBadge } from '@packages/order-ui';
import { observer } from 'mobx-react-lite';

import { Card } from '../components/Card';
import { DispatcherColumn } from '../components/DispatcherColumn';
import { socket } from '../socket';
import { store } from '../store';

export const SettingsColumn = observer(function SettingsColumn() {
  const { online } = store;

  useEffect(() => {}, [socket.id]);

  return (
    <DispatcherColumn>
      <Text px="3" py="2" fontWeight="semibold" fontSize="sm">
        Настройки / Навигация
      </Text>
      <Card>        
        <HStack p={3} align="center" gap="3" minW={0} justify="space-between">
          <Text fontSize="sm" color="gray.800" truncate>Администратор</Text>
          <OrderNetworkStatusBadge online={online} />
        </HStack>
      </Card>
    </DispatcherColumn>
  );
});
