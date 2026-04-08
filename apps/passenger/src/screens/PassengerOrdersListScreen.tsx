import { useEffect, useState } from 'react';
import type { Order, OrdersListResponse, PassengerOrdersPayload } from '@packages/shared';
import { call } from '../api';
import { socket } from '../socket';
import { OrdersListMode } from '../modes/OrdersListMode';

export function PassengerOrdersListScreen(props: {
  token: string;
  onError: (message: string | null) => void;
  onUnauthorized: () => void;
  onOrdersUpdated: (items: Order[]) => void;
  onCreate: () => void;
  onOpenOrder: (order: Order) => void;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOnline, setIsOnline] = useState(() => socket.connected);

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
    if (!isOnline) return;
    if (!props.token) return;

    const onPassengerOrders = (payload: PassengerOrdersPayload) => {
      setOrders(payload.items);
      props.onOrdersUpdated(payload.items);
    };

    socket.on('passenger:orders', onPassengerOrders);
    return () => {
      socket.off('passenger:orders', onPassengerOrders);
    };
  }, [isOnline, props.token]);

  useEffect(() => {
    if (!isOnline) return;
    if (!props.token) return;

    void (async () => {
      props.onError(null);
      const listRes = (await call<{}, OrdersListResponse>('orders:list', {})) as OrdersListResponse;
      if (!listRes.ok) {
        if (listRes.error.code === 'UNAUTHORIZED') {
          props.onUnauthorized();
          return;
        }
        props.onError(listRes.error.message);
        return;
      }

      setOrders(listRes.data.items);
      props.onOrdersUpdated(listRes.data.items);
    })();
  }, [isOnline, props.token]);

  return <OrdersListMode orders={orders} onCreate={props.onCreate} onOpenOrder={props.onOpenOrder} />;
}

