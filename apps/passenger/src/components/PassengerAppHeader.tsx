import { observer } from 'mobx-react-lite';
import { Box, HStack, Text } from '@chakra-ui/react';
import { OrderNetworkStatusBadge } from '@packages/order-ui';

import PassengerAppMenu from './PassengerAppMenu';
import { store } from '../store';

function PassengerInlineSeparatorDot() {
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

function PassengerAppHeader() {
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
          <Text fontSize="sm" fontWeight="bold" color="blue.600" flex="none" whiteSpace="nowrap">
            #{currentUser.id}
          </Text>
        )}
        {currentUser && (
          <HStack gap="1.5" align="center" minW="0" flex="1" title={`${currentUser.name} · ${currentUser.phone}`}>
            <Text as="span" fontSize="sm" fontWeight="semibold" color="gray.800" truncate>
              {currentUser.name}
            </Text>
            <PassengerInlineSeparatorDot />
            <Text as="span" fontSize="sm" color="gray.600" flex="1" minW={0} truncate>
              {currentUser.phone}
            </Text>
          </HStack>
        )}
      </HStack>
      <HStack gap="3" align="center">
        <OrderNetworkStatusBadge online={store.online} />
        <PassengerAppMenu />
      </HStack>
    </HStack>
  );
}

export default observer(PassengerAppHeader);
