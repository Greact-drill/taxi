import { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Badge,
  Box,
  Button,
  Center,
  HStack,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';


import { clearTokenReconnect } from './socket';
import { HamburgerIcon } from './components/HamburgerIcon';
import PassengerAppContentScreen from './screens/PassengerAppContentScreen';
import { store } from './store';

function App() {
  const currentUser = store.currentUser;
  const statusLabel = store.online ? 'В сети' : 'Нет сети';

  const onLogout = async () => {
    clearTokenReconnect();
  }

  return (
    <Box bg="gray.50" minH="100dvh">
      <Box
        bg="white"
        minH="100dvh"
        maxW="420px"
        mx="auto"
        display="flex"
        flexDirection="column"
        borderLeftWidth="1px"
        borderRightWidth="1px"
        borderColor="blackAlpha.200"
      >
        <HStack
          as="header"
          px="4"
          py="3"
          borderBottomWidth="1px"
          borderColor="blackAlpha.200"
          justify="space-between"
        >
          <HStack gap="3" minW="0">
            <Badge
              px="2"
              py="1"
              borderRadius="full"
              colorPalette={store.online ? 'green' : 'red'}
              variant="subtle"
              fontSize="xs"
              flex="none"
            >
              {statusLabel}
            </Badge>
            {currentUser ? (
              <VStack gap="0" align="start" minW="0" lineHeight="shorter">
                <Text fontSize="sm" fontWeight="semibold" truncate>
                  {currentUser.name}
                </Text>
                <Text fontSize="xs" color="gray.600" truncate>
                  {currentUser.phone}
                </Text>
              </VStack>
            ) : null}
          </HStack>
          <HStack gap="3">
            <MenuRoot positioning={{ placement: 'bottom-end' }}>
              <MenuTrigger asChild>
                <Button variant="ghost" size="sm" px="2" aria-label="Меню">
                  <HamburgerIcon />
                </Button>
              </MenuTrigger>
              <Portal>
                <MenuPositioner>
                  <MenuContent>
                    <MenuItem value="logout" onClick={() => void onLogout()}>
                      Выход
                    </MenuItem>
                  </MenuContent>
                </MenuPositioner>
              </Portal>
            </MenuRoot>
          </HStack>
        </HStack>

        <Box as="main" position="relative" flex="1" px="4" py="6">
          <VStack gap="3" align="stretch">
            <PassengerAppContentScreen />
          </VStack>

          {!store.online ? (
            <Center
              position="absolute"
              inset="0"
              bg="blackAlpha.400"
              color="white"
              textAlign="center"
              px="6"
            />
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}

export default observer(App);
