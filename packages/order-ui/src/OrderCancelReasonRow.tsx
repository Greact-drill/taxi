import { Text } from '@chakra-ui/react';

export type OrderCancelReasonRowProps = {
  cancelReason?: string;
};

/** One line when a cancelled order has a non-empty reason. */
export function OrderCancelReasonRow({ cancelReason }: OrderCancelReasonRowProps) {
  const t = cancelReason?.trim();
  if (!t) return null;

  return (
    <Text mt="3" fontSize="sm" color="gray.600">
      <Text as="span" color="gray.500">
        Причина отмены:{' '}
      </Text>
      {t}
    </Text>
  );
}
