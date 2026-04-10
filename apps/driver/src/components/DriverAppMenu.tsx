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
import { clearTokenReconnect } from '../socket';
import { useStore } from '../store';

function DriverAppMenu() {
  const store = useStore();

  return (
    <MenuRoot positioning={{ placement: 'bottom-end' }}>
      <MenuTrigger asChild>
        <Button variant="ghost" size="sm" px="2" aria-label="Меню">
          <AlignJustify size={20} strokeWidth={2} aria-hidden />
        </Button>
      </MenuTrigger>
      <Portal>
        <MenuPositioner>
          <MenuContent>
            {store.currentUser ? (
              <MenuItem value="stub-history" disabled>
                История заявок
              </MenuItem>
            ) : null}
            <MenuItem value="logout" onClick={() => void clearTokenReconnect()}>
              Выход
            </MenuItem>
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  );
}

export default observer(DriverAppMenu);
