import { useEffect } from 'react';
import { Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { DispatcherColumn } from '../components/DispatcherColumn';
import { DriverAppHeader } from '../components/DriverAppHeader';
import { socket } from '../socket';
import { store } from '../store';

export const DriversColumn = observer(function DriversColumn() {
  const { online, drivers } = store;

  useEffect(() => {
    socket.emit('dispatcher:drivers:request');
  }, [socket.id]);

  return (
    <DispatcherColumn>
      <Text px="3" py="2" fontWeight="semibold" fontSize="sm">
        Водители
      </Text>
      {drivers.map((driver) => (
        <DriverAppHeader key={driver.id} driver={driver} online={online} />
      ))}
    </DispatcherColumn>
  );
});
