import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { socket } from '../socket';
import { useStore } from '../store';

function DriverLoginScreen() {
  const store = useStore();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const loginTrim = login.trim();
  const canSubmit = loginTrim.length > 0 && password.length > 0;

  function onSubmit(): void {
    store.clearError();
    socket.emit('driver:auth:login', { login: loginTrim, password });
  }

  return (
    <Box borderWidth="1px" borderColor="blackAlpha.200" borderRadius="lg" p="4">
      <Text fontSize="lg" fontWeight="semibold">
        Вход
      </Text>
      <VStack gap="3" align="stretch" mt="3">
        <Input
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          autoComplete="username"
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <Button size="lg" onClick={onSubmit} disabled={!canSubmit}>
          Войти
        </Button>
      </VStack>
    </Box>
  );
}

export default observer(DriverLoginScreen);
