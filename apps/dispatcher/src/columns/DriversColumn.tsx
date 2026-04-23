import { useEffect } from 'react';
import {
  Box,
  Button,
  DialogBackdrop,
  DialogContent,
  DialogPositioner,
  DialogRoot,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { Card } from '../components/Card';
import { DriverCreateDialog } from '../components/DriverCreateDialog';
import { DriverEditDialog } from '../components/DriverEditDialog';
import { DispatcherColumn } from '../components/DispatcherColumn';
import { DriverAppHeader } from '../components/DriverAppHeader';
import { socket } from '../socket';
import { store, checkOnline } from '../store';

function DriversColumn() {
  const { drivers, screen, screenForm, screenFormData } = store;

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
          onClick={() => store.openEditDriverForm(driver)}
        >
          <Card>
            <DriverAppHeader driver={driver} online={checkOnline(`driver:${driver.id}`)} />
          </Card>
        </Box>
      ))}
      <Button
        type="button"
        variant="outline"
        borderStyle="dashed"
        borderWidth="2px"
        borderRadius="lg"
        borderColor="purple.600"
        p="4"
        h="auto"
        w="100%"
        minH="5.75rem"
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={() => store.openCreateDriverForm()}
      >
        <VStack gap="1" align="center">
          <Box color="purple.600" lineHeight="0">
            <Plus size={32} strokeWidth={2} aria-hidden />
          </Box>
          <Text fontSize="sm" fontWeight="semibold" textAlign="center">
            Зарегистрировать нового водителя
          </Text>
        </VStack>
      </Button>
      <DialogRoot
        open={screen === 'form'}
        onOpenChange={(dialog) => {
          if (!dialog.open) store.openList();
        }}
        size="sm"
      >
        <Portal>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent>
              {screenForm === 'create' && <DriverCreateDialog close={() => store.openList()} />}
              {screenForm === 'edit' && screenFormData && (
                <DriverEditDialog
                  key={screenFormData.id}
                  driver={screenFormData}
                  close={() => store.openList()}
                />
              )}
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>
    </DispatcherColumn>
  );
};

export default observer(DriversColumn);
