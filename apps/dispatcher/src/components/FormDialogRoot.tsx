import {
  DialogBackdrop,
  DialogContent,
  DialogPositioner,
  DialogRoot,
  Portal,
} from '@chakra-ui/react';
import type { Driver, Passenger } from '@packages/shared';
import { observer } from 'mobx-react-lite';
import { store } from '../store';
import { DriverCreateDialog } from './DriverCreateDialog';
import { DriverEditDialog } from './DriverEditDialog';
import { PassengerEditDialog } from './PassengerEditDialog';

function FormDialogRoot() {
  const { screen, screenForm, screenFormData, screenFormDataType } = store;

  return (
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
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
}

export default observer(FormDialogRoot);
