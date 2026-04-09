import {
  Button,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
} from '@chakra-ui/react';

import { HamburgerIcon } from './HamburgerIcon';
import { clearTokenReconnect } from '../socket';

function PassengerAppMenu() {
  return (
    <MenuRoot positioning={{ placement: 'bottom-end' }}>
      <MenuTrigger asChild>
        <Button variant="ghost" size="sm" px="2" aria-label="Меню">
          <HamburgerIcon />
        </Button>
      </MenuTrigger>
      <Portal>
        <MenuPositioner>
          <MenuContent>
            <MenuItem value="logout" onClick={() => void clearTokenReconnect()}>
              Выход
            </MenuItem>
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  );
}

export default PassengerAppMenu;
