import { observer } from 'mobx-react-lite';
import { Badge, HStack, Text, VStack } from '@chakra-ui/react';

import PassengerAppMenu from './PassengerAppMenu';
import { store } from '../store';

function PassengerAppHeader() {
  const currentUser = store.currentUser;
  const statusLabel = store.online ? 'В сети' : 'Нет сети';

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
          <Text fontSize="xs" color="gray.600" flex="none" whiteSpace="nowrap">
            #{currentUser.id}
          </Text>
        )}
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
        {currentUser && (
          <VStack gap="0" align="start" minW="0" lineHeight="shorter" flex="1">
            <Text fontSize="sm" fontWeight="semibold" truncate>
              {currentUser.name}
            </Text>
            <Text fontSize="xs" color="gray.600" truncate>
              {currentUser.phone}
            </Text>
          </VStack>
        )}
      </HStack>
      <HStack gap="3">
        <PassengerAppMenu />
      </HStack>
    </HStack>
  );
}

export default observer(PassengerAppHeader);
