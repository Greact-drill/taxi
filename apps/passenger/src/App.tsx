import { useEffect, useState } from 'react';
import { socket } from './socket';
import './app.css';

export default function App() {
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <main className="page">
      <h1>Пассажир</h1>
      <div
        className={
          connected ? 'status status--online' : 'status status--offline'
        }
        aria-label={connected ? 'Сервер доступен' : 'Сервер недоступен'}
      />
      <p>{connected ? 'Сервер доступен' : 'Сервер недоступен'}</p>
    </main>
  );
}
