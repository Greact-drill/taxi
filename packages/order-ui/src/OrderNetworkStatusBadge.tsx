import { Badge, HStack } from '@chakra-ui/react';
import { CircleCheck, CircleX } from 'lucide-react';

export type OrderNetworkStatusBadgeProps = {
  online: boolean;
};

export function OrderNetworkStatusBadge({ online }: OrderNetworkStatusBadgeProps) {
  const label = online ? 'В сети' : 'Не в сети';
  const StatusIcon = online ? CircleCheck : CircleX;

  return (
    <Badge px="2" py="1" borderRadius="full" colorPalette={online ? 'green' : 'red'} variant="subtle" fontSize="xs" flexShrink={0}>
      <HStack gap="1.5" align="center">
        <StatusIcon size={16} strokeWidth={2} aria-hidden />
        {label}
      </HStack>
    </Badge>
  );
}
