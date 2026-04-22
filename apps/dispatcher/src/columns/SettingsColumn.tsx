import { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
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
        <Box p="3">
          <OrderNetworkStatusBadge online={online} />
        </Box>
      </Card>
    </DispatcherColumn>
  );
});
