import { useEffect, useMemo, useState } from 'react';
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
import type {
  AuthCheckResponse,
  MeGetResponse,
  Passenger,
} from '@packages/shared';
import { call } from './api';
import { socket } from './socket';
import { clearStoredToken, getStoredToken, setStoredToken } from './socket';
import { HamburgerIcon } from './components/HamburgerIcon';
import { PassengerAppContentScreen } from './screens/PassengerAppContentScreen';

export default function App() {
  const [isOnline, setIsOnline] = useState(() => socket.connected);
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [passenger, setPassenger] = useState<Passenger | null>(null);

  function resetAuthedState(): void {
    setPassenger(null);
  }

  function logoutLocal(): void {
    clearStoredToken();
    setToken(null);
    resetAuthedState();
  }

  function reconnectWithToken(nextToken?: string): void {
    socket.disconnect();
    socket.auth = { role: 'passenger', token: nextToken };
    socket.connect();
  }

  useEffect(() => {
    const onConnect = () => setIsOnline(true);
    const onDisconnect = () => setIsOnline(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  async function ensureTokenIsValid(): Promise<boolean> {
    if (!token) return false;
    const checkRes = (await call<{ token?: string }, AuthCheckResponse>('auth:check', {
      token,
    })) as AuthCheckResponse;

    if (!checkRes.ok) {
      return false;
    }

    if (!checkRes.data.passenger) {
      logoutLocal();
      reconnectWithToken(undefined);
      return false;
    }

    setPassenger(checkRes.data.passenger);
    return true;
  }

  async function refreshMe(): Promise<void> {
    const meRes = (await call<{}, MeGetResponse>('me:get', {})) as MeGetResponse;
    if (!meRes.ok) {
      if (meRes.error.code === 'UNAUTHORIZED') {
        logoutLocal();
        reconnectWithToken(undefined);
        return;
      }
      return;
    }

    setPassenger(meRes.data.passenger);
  }

  useEffect(() => {
    if (!token) return;
    if (!isOnline) return;
    void (async () => {
      const valid = await ensureTokenIsValid();
      if (!valid) return;
      await refreshMe();
    })();
  }, [token, isOnline]);

  async function onLogout(): Promise<void> {
    logoutLocal();
    reconnectWithToken(undefined);
  }

  const statusLabel = useMemo(() => (isOnline ? 'В сети' : 'Нет сети'), [isOnline]);

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
              colorPalette={isOnline ? 'green' : 'red'}
              variant="subtle"
              fontSize="xs"
              flex="none"
            >
              {statusLabel}
            </Badge>
            {passenger ? (
              <VStack gap="0" align="start" minW="0" lineHeight="shorter">
                <Text fontSize="sm" fontWeight="semibold" truncate>
                  {passenger.name}
                </Text>
                <Text fontSize="xs" color="gray.600" truncate>
                  {passenger.phone}
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
            <PassengerAppContentScreen
              token={token}
              onRegistered={(nextToken: string, nextPassenger: Passenger) => {
                setStoredToken(nextToken);
                setToken(nextToken);
                setPassenger(nextPassenger);
                reconnectWithToken(nextToken);
              }}
              onUnauthorized={() => {
                logoutLocal();
                reconnectWithToken(undefined);
              }}
            />
          </VStack>

          {!isOnline ? (
            <Center
              position="absolute"
              inset="0"
              bg="blackAlpha.400"
              color="white"
              textAlign="center"
              px="6"
            >
              <Text fontSize="sm" fontWeight="medium">
                Нет сети
              </Text>
            </Center>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
