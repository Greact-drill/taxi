import { Box, Text, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { DriverActiveOrderPreview } from '../components/DriverActiveOrderPreview';
import { useStore } from '../store';

function DriverActiveOrdersListScreen() {
  const store = useStore();

  return (
    <Box
      borderRadius="xl"
      bg="colorPalette.muted"
      boxShadow='inset 0 3px 14px rgba(0, 0, 0, 0.1), inset 0 1px 4px rgba(0, 0, 0, 0.06)'
      p="3"
      flex="1"
      minH="0"
      display="flex"
      flexDirection="column"
      overflowY="auto"
    >
      <Text fontSize="sm" fontWeight="semibold" color="colorPalette.fg" opacity={0.85} px="1" mb="2" flexShrink={0}>
        Открытые заказы
      </Text>
      <VStack gap="2" align="stretch" flex="1" minH="0">
        {store.activeOrders.map((order) => (
          <DriverActiveOrderPreview
            key={order.id}
            order={order}
            onClick={() => store.openOrderForm(order)}
          />
        ))}
      </VStack>
    </Box>
  );
}

export default observer(DriverActiveOrdersListScreen);
