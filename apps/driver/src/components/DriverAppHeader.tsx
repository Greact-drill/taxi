import { observer } from 'mobx-react-lite';
import { Box, HStack, Text } from '@chakra-ui/react';
import { OrderNetworkStatusBadge } from '@packages/order-ui';

import DriverAppMenu from './DriverAppMenu';
import { useStore } from '../store';

function DriverInlineSeparatorDot() {
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      color="gray.400"
      lineHeight="0"
      aria-hidden
    >
      <svg width="6" height="6" viewBox="0 0 5 5">
        <circle cx="2.5" cy="2.5" r="2" fill="currentColor" />
      </svg>
    </Box>
  );
}

function DriverAppHeader() {
  const store = useStore();
  const currentUser = store.currentUser;

  return (
    <HStack
      as="header"
      px="4"
      py="3"
      borderBottomWidth="1px"
      borderColor="blackAlpha.200"
      justify="space-between"
    >
      <HStack gap="3" minW="0" align="center">
        {currentUser && (
          <Text fontSize="sm" fontWeight="bold" color="purple.600" flex="none" whiteSpace="nowrap">
            #{currentUser.id}
          </Text>
        )}
        {currentUser && (
          <HStack gap="1.5" align="center" minW="0" flex="1" title={`${currentUser.name} · ${currentUser.car}`}>
            <Text as="span" fontSize="sm" fontWeight="semibold" color="gray.800" truncate>
              {currentUser.name}
            </Text>
            <DriverInlineSeparatorDot />
            <Text as="span" fontSize="sm" color="gray.600" flex="1" minW={0} truncate>
              {currentUser.car}
            </Text>
          </HStack>
        )}
      </HStack>
      <HStack gap="3" align="center">
        <OrderNetworkStatusBadge online={store.online} />
        <DriverAppMenu />
      </HStack>
    </HStack>
  );
}

export default observer(DriverAppHeader);
