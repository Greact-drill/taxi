import {
  Box,
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  HStack,
} from '@chakra-ui/react';
import type { Order } from '@packages/shared';
import { ArrowLeft } from 'lucide-react';
import DispatcherOrderChat from './DispatcherOrderChat';
import { OrderEditForm } from './OrderEditForm';

export type OrderEditDialogProps = {
  order: Order;
  close: () => void;
};

export function OrderEditDialog(props: OrderEditDialogProps) {
  return (
    <Box display="flex" flexDirection="column" flex="1" minH="0" h="full" minW="0" w="100%">
      <DialogHeader flexShrink={0}>
        <HStack align="center" gap="3" w="100%">
          <Button
            variant="outline"
            onClick={props.close}
            w="10"
            h="10"
            minW="10"
            p="0"
            aria-label="Назад"
            flexShrink={0}
          >
            <ArrowLeft size={18} aria-hidden />
          </Button>
          <DialogTitle flex="1" minW={0} lineHeight="1.2">
            Заявка #{props.order.id}
          </DialogTitle>
          <DialogCloseTrigger />
        </HStack>
      </DialogHeader>
      <DialogBody
        flex="1"
        minH="0"
        minW="0"
        overflow="hidden"
        py="4"
        display="grid"
        gridTemplateColumns="minmax(0, 1fr) minmax(0, 1fr)"
        gridTemplateRows="minmax(0, 1fr)"
        columnGap="4"
      >
        <Box minH="0" minW="0" overflowY="auto">
          <OrderEditForm order={props.order} close={props.close} />
        </Box>
        <Box display="flex" flexDirection="column" minH="0" minW="0" overflow="hidden">
          <DispatcherOrderChat orderId={props.order.id} />
        </Box>
      </DialogBody>
    </Box>
  );
}
