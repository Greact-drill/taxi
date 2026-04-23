import { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { Card } from '../components/Card';
import { DispatcherColumn } from '../components/DispatcherColumn';
import { PassengerAppHeader } from '../components/PassengerAppHeader';
import { socket } from '../socket';
import { checkOnline, store } from '../store';

function PassengersColumn() {
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
        <Box
          key={passenger.id}
          w="100%"
          cursor="pointer"
          onClick={() => store.openEditPassengerForm(passenger)}
        >
          <Card>
            <PassengerAppHeader passenger={passenger} online={checkOnline(`passenger:${passenger.id}`)} />
          </Card>
        </Box>
      ))}
    </DispatcherColumn>
  );
};

export default observer(PassengersColumn);
