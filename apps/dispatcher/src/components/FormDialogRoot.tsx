import {
  DialogBackdrop,
  DialogContent,
  DialogPositioner,
  DialogRoot,
  Portal,
} from '@chakra-ui/react';
import type { Driver, Order, Passenger } from '@packages/shared';
import { observer } from 'mobx-react-lite';
import { store } from '../store';
import { DriverCreateDialog } from './DriverCreateDialog';
import { DriverEditDialog } from './DriverEditDialog';
import { OrderEditDialog } from './OrderEditDialog';
import { PassengerEditDialog } from './PassengerEditDialog';

function FormDialogRoot() {
  const { screen, screenForm, screenFormData, screenFormDataType } = store;
  const orderFormOpen =
    screen === 'form' && screenForm === 'edit' && screenFormDataType === 'order' && screenFormData;

  return (
    <DialogRoot
      open={screen === 'form'}
      onOpenChange={(dialog) => {
        if (!dialog.open) store.openList();
      }}
      size={screenFormDataType === 'order' ? 'xl' : 'sm'}
    >
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent
            display={orderFormOpen ? 'flex' : undefined}
            flexDirection={orderFormOpen ? 'column' : undefined}
            h={orderFormOpen ? '85dvh' : undefined}
            maxH={orderFormOpen ? '85dvh' : undefined}
            overflow={orderFormOpen ? 'hidden' : undefined}
            minH={orderFormOpen ? 0 : undefined}
          >
            {screenForm === 'create' && screenFormDataType === 'driver' && (
              <DriverCreateDialog close={() => store.openList()} />
            )}
            {screenForm === 'edit' && screenFormDataType === 'driver' && screenFormData && (
              <DriverEditDialog
                key={screenFormData.id}
                driver={screenFormData as Driver}
                close={() => store.openList()}
              />
            )}
            {screenForm === 'edit' && screenFormDataType === 'passenger' && screenFormData && (
              <PassengerEditDialog
                key={screenFormData.id}
                passenger={screenFormData as Passenger}
                close={() => store.openList()}
              />
            )}
            {screenForm === 'edit' && screenFormDataType === 'order' && screenFormData && (
              <OrderEditDialog
                key={screenFormData.id}
                order={screenFormData as Order}
                close={() => store.openList()}
              />
            )}
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
}

export default observer(FormDialogRoot);
