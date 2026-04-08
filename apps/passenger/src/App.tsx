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
  AuthRegisterResponse,
  MeGetResponse,
  Order,
  OrdersCreateResponse,
  OrdersDeleteResponse,
  OrdersListResponse,
  OrdersUpdateResponse,
  PassengerOrdersPayload,
  Passenger,
} from '@packages/shared';
import { call } from './api';
import { socket } from './socket';
import { clearStoredToken, getStoredToken, setStoredToken } from './socket';
import { HamburgerIcon } from './components/HamburgerIcon';
import { RegisterMode } from './modes/RegisterMode';
import { OrdersListMode } from './modes/OrdersListMode';
import { OrderCreateMode } from './modes/OrderCreateMode';
import { OrderEditMode } from './modes/OrderEditMode';

export default function App() {
  const [isOnline, setIsOnline] = useState(() => socket.connected);
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [passenger, setPassenger] = useState<Passenger | null>(null);
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>(() => 'list');
  const [errorText, setErrorText] = useState<string | null>(null);

  function resetAuthedState(): void {
    setPassenger(null);
    setOrders([]);
    setActiveOrder(null);
    setMode('list');
    setFrom('');
    setTo('');
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

  useEffect(() => {
    const onPassengerOrders = (payload: PassengerOrdersPayload) => {
      setOrders(payload.items);
      if (activeOrder && !payload.items.some((o) => o.id === activeOrder.id)) {
        setActiveOrder(null);
        setMode('list');
        setFrom('');
        setTo('');
      }
    };

    socket.on('passenger:orders', onPassengerOrders);
    return () => {
      socket.off('passenger:orders', onPassengerOrders);
    };
  }, [activeOrder]);

  async function ensureTokenIsValid(): Promise<boolean> {
    if (!token) return false;
    const checkRes = (await call<{ token?: string }, AuthCheckResponse>('auth:check', {
      token,
    })) as AuthCheckResponse;

    if (!checkRes.ok) {
      setErrorText(checkRes.error.message);
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

  async function refreshMeAndOrders(): Promise<void> {
    setErrorText(null);

    const meRes = (await call<{}, MeGetResponse>('me:get', {})) as MeGetResponse;
    if (!meRes.ok) {
      if (meRes.error.code === 'UNAUTHORIZED') {
        logoutLocal();
        reconnectWithToken(undefined);
        return;
      }
      setErrorText(meRes.error.message);
      return;
    }

    setPassenger(meRes.data.passenger);

    const listRes = (await call<{}, OrdersListResponse>('orders:list', {})) as OrdersListResponse;
    if (!listRes.ok) {
      setErrorText(listRes.error.message);
      return;
    }

    setOrders(listRes.data.items);
  }

  useEffect(() => {
    if (!token) return;
    if (!isOnline) return;
    void (async () => {
      const valid = await ensureTokenIsValid();
      if (!valid) return;
      await refreshMeAndOrders();
    })();
  }, [token, isOnline]);

  async function onRegister(): Promise<void> {
    setErrorText(null);
    const res = (await call<
      { name: string; phone: string },
      AuthRegisterResponse
    >('auth:register', { name: passengerName, phone: passengerPhone })) as AuthRegisterResponse;

    if (!res.ok) {
      setErrorText(res.error.message);
      return;
    }

    setStoredToken(res.data.token);
    setToken(res.data.token);
    setPassenger(res.data.passenger);

    reconnectWithToken(res.data.token);
  }

  async function onLogout(): Promise<void> {
    setErrorText(null);
    logoutLocal();
    reconnectWithToken(undefined);
  }

  async function onCreateOrder(): Promise<void> {
    setErrorText(null);
    const res = (await call<
      { from: string; to: string },
      OrdersCreateResponse
    >('orders:create', { from, to })) as OrdersCreateResponse;

    if (!res.ok) {
      setErrorText(res.error.message);
      return;
    }

    setMode('list');
    setFrom('');
    setTo('');
  }

  async function onUpdateOrder(): Promise<void> {
    if (!activeOrder) return;
    setErrorText(null);

    const res = (await call<
      { id: number; from: string; to: string },
      OrdersUpdateResponse
    >('orders:update', { id: activeOrder.id, from, to })) as OrdersUpdateResponse;

    if (!res.ok) {
      setErrorText(res.error.message);
      return;
    }

    setActiveOrder(null);
    setMode('list');
    setFrom('');
    setTo('');
  }

  async function onDeleteOrder(): Promise<void> {
    if (!activeOrder) return;
    setErrorText(null);

    const res = (await call<{ id: number }, OrdersDeleteResponse>('orders:delete', {
      id: activeOrder.id,
    })) as OrdersDeleteResponse;

    if (!res.ok) {
      setErrorText(res.error.message);
      return;
    }

    setActiveOrder(null);
    setMode('list');
    setFrom('');
    setTo('');
  }

  const statusLabel = useMemo(() => (isOnline ? 'В сети' : 'Нет сети'), [isOnline]);

  const screen =
    !token ? (
      <RegisterMode
        name={passengerName}
        phone={passengerPhone}
        onChangeName={setPassengerName}
        onChangePhone={setPassengerPhone}
        onSubmit={() => void onRegister()}
      />
    ) : mode === 'list' ? (
      <OrdersListMode
        orders={orders}
        onCreate={() => {
          setMode('create');
          setActiveOrder(null);
          setFrom('');
          setTo('');
        }}
        onOpenOrder={(o) => {
          setActiveOrder(o);
          setMode('edit');
          setFrom(o.from);
          setTo(o.to);
        }}
      />
    ) : mode === 'create' ? (
      <OrderCreateMode
        from={from}
        to={to}
        onChangeFrom={setFrom}
        onChangeTo={setTo}
        onSubmit={() => void onCreateOrder()}
        onCancel={() => {
          setMode('list');
          setFrom('');
          setTo('');
        }}
      />
    ) : activeOrder ? (
      <OrderEditMode
        order={activeOrder}
        from={from}
        to={to}
        onChangeFrom={setFrom}
        onChangeTo={setTo}
        onSubmit={() => void onUpdateOrder()}
        onDelete={() => void onDeleteOrder()}
        onBack={() => {
          setMode('list');
          setActiveOrder(null);
          setFrom('');
          setTo('');
        }}
      />
    ) : null;

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
            {errorText ? (
              <Box
                borderWidth="1px"
                borderColor="red.200"
                bg="red.50"
                color="red.800"
                px="3"
                py="2"
                borderRadius="md"
                fontSize="sm"
              >
                {errorText}
              </Box>
            ) : null}
            {screen}
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
