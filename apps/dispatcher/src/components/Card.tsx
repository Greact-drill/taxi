import { VStack } from '@chakra-ui/react';
import type { ComponentProps, ReactNode } from 'react';

export type CardProps = Omit<ComponentProps<typeof VStack>, 'align' | 'gap'> & {
  children: ReactNode;
};

export function Card({ children, ...rest }: CardProps) {
  return (
    <VStack
      align="stretch"
      bg="white"
      gap={0}
      border="1px solid"
      borderColor="colorPalette.muted"
      borderRadius="md"
      p="2"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 10px 22px -4px rgba(0, 0, 0, 0.12)"
      {...rest}
    >
      {children}
    </VStack>
  );
}
