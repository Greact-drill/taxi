import { useEffect, useState } from 'react';
import type { DispatcherConnectionsPayload } from '@packages/shared';
import { socket } from './socket';
import './app.css';

export default function App() {
  const [connections, setConnections] = useState<DispatcherConnectionsPayload['items']>([]);
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnections = (payload: DispatcherConnectionsPayload) => setConnections(payload.items);
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on('dispatcher:connections', onConnections);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('dispatcher:connections', onConnections);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <main className="page">
      <h1>
        Диспетчер{' '}
        <span className={connected ? 'badge badge--on' : 'badge badge--off'}>
          {connected ? 'онлайн' : 'офлайн'}
        </span>
      </h1>
      <p>
        Активных соединений: <strong>{connections.length}</strong>
      </p>
      <ul className="list">
        {connections.map((item, index) => (
          <li key={index} className="list__item">
            <span>{item.role}</span>
            <span>{item.token}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
