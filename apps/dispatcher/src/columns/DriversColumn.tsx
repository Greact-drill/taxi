import { useEffect } from 'react';
import { Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { Card } from '../components/Card';
import { DispatcherColumn } from '../components/DispatcherColumn';
import { DriverAppHeader } from '../components/DriverAppHeader';
import { socket } from '../socket';
import { store, checkOnline } from '../store';

export const DriversColumn = observer(function DriversColumn() {
  const { drivers } = store;

  useEffect(() => {
    socket.emit('dispatcher:drivers:request');
  }, [socket.id]);

  return (
    <DispatcherColumn>
      <Text px="3" py="2" fontWeight="semibold" fontSize="sm">
        Водители
      </Text>
      {drivers.map((driver) => (
        <Card key={driver.id}>
          <DriverAppHeader driver={driver} online={checkOnline(`driver:${driver.id}`)} />
        </Card>
      ))}
    </DispatcherColumn>
  );
});
