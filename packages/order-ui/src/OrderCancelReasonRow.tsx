import { Box, Text } from '@chakra-ui/react';

export type OrderCancelReasonRowProps = {
  cancelReason?: string;
};

/** Cancel reason text in a light red bordered box when non-empty. */
export function OrderCancelReasonRow({ cancelReason }: OrderCancelReasonRowProps) {

  return (
    <Box
      mt="3"
      px="3"
      py="2.5"
      borderRadius="md"
      borderWidth="1px"
      borderColor="red.400"
    >
      <Text fontSize="sm" color="gray.700">
        {cancelReason}
      </Text>
    </Box>
  );
}
