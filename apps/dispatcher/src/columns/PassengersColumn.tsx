import { useEffect } from 'react';
import { Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { Card } from '../components/Card';
import { DispatcherColumn } from '../components/DispatcherColumn';
import { PassengerAppHeader } from '../components/PassengerAppHeader';
import { socket } from '../socket';
import { checkOnline, store } from '../store';

export const PassengersColumn = observer(function PassengersColumn() {
  const { passengers } = store;

  useEffect(() => {
    socket.emit('dispatcher:passengers:request');
  }, [socket.id]);

  return (
    <DispatcherColumn>
      <Text px="3" py="2" fontWeight="semibold" fontSize="sm">
        Пассажиры
      </Text>
      {passengers.map((passenger) => (
        <Card key={passenger.id}>
          <PassengerAppHeader passenger={passenger} online={checkOnline(`passenger:${passenger.id}`)} />
        </Card>
      ))}
    </DispatcherColumn>
  );
});
