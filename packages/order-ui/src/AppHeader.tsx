import { HStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';

export type AppHeaderProps = {
  children: ReactNode;
};

export function AppHeader({ children }: AppHeaderProps) {
  return (
    <HStack
      as="header"
      px="4"
      borderBottomWidth="1px"
      borderColor="blackAlpha.200"
      justify="space-between"
    >
      {children}
    </HStack>
  );
}
