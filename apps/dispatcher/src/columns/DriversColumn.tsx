import { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import type { Driver } from '@packages/shared';

import { Card } from '../components/Card';
import { DriverEditDialog } from '../components/DriverEditDialog';
import { DispatcherColumn } from '../components/DispatcherColumn';
import { DriverAppHeader } from '../components/DriverAppHeader';
import { socket } from '../socket';
import { store, checkOnline } from '../store';

export const DriversColumn = observer(function DriversColumn() {
  const { drivers } = store;
  const [editing, setEditing] = useState<Driver | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    socket.emit('dispatcher:drivers:request');
  }, [socket.id]);

  return (
    <DispatcherColumn>
      <Text px="3" py="2" fontWeight="semibold" fontSize="sm">
        Водители
      </Text>
      {drivers.map((driver) => (
        <Box
          key={driver.id}
          w="100%"
          cursor="pointer"
          onClick={() => {
            setEditing(driver);
            setDialogOpen(true);
          }}
        >
          <Card>
            <DriverAppHeader driver={driver} online={checkOnline(`driver:${driver.id}`)} />
          </Card>
        </Box>
      ))}
      <DriverEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onExitComplete={() => setEditing(null)}
        driver={editing}
      />
    </DispatcherColumn>
  );
});
