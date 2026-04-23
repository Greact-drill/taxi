import { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import type { Passenger } from '@packages/shared';

import { Card } from '../components/Card';
import { DispatcherColumn } from '../components/DispatcherColumn';
import { PassengerAppHeader } from '../components/PassengerAppHeader';
import { PassengerEditDialog } from '../components/PassengerEditDialog';
import { socket } from '../socket';
import { checkOnline, store } from '../store';

export const PassengersColumn = observer(function PassengersColumn() {
  const { passengers } = store;
  const [editing, setEditing] = useState<Passenger | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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
          onClick={() => {
            setEditing(passenger);
            setDialogOpen(true);
          }}
        >
          <Card>
            <PassengerAppHeader passenger={passenger} online={checkOnline(`passenger:${passenger.id}`)} />
          </Card>
        </Box>
      ))}
      {editing && (
        <PassengerEditDialog
          key={editing.id}
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditing(null);
          }}
          passenger={editing}
        />
      )}
    </DispatcherColumn>
  );
});
