import { useState } from 'react';
import {
  Button,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
} from '@chakra-ui/react';
import { AlignJustify } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import PassengerProfileEditDialog from './PassengerProfileEditDialog';
import { clearTokenReconnect } from '../socket';
import { useStore } from '../store';

function PassengerAppMenu() {
  const store = useStore();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <MenuRoot positioning={{ placement: 'bottom-end' }}>
        <MenuTrigger asChild>
          <Button variant="ghost" size="sm" px="2" aria-label="Меню">
            <AlignJustify size={20} strokeWidth={2} aria-hidden />
          </Button>
        </MenuTrigger>
        <Portal>
          <MenuPositioner>
            <MenuContent>
              {store.currentUser && (
                <>
                  <MenuItem
                    value="profile"
                    onClick={() => setProfileOpen(true)}
                  >
                    Изменить свои данные
                  </MenuItem>
                  {/* <MenuItem value="order-history">История заказов</MenuItem> */}
                </>
              )}
              <MenuItem value="logout" onClick={() => void clearTokenReconnect()}>
                Выход
              </MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Portal>
      </MenuRoot>
      <PassengerProfileEditDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  );
}

export default observer(PassengerAppMenu);
