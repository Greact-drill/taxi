import { Box, VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';

export type DispatcherColumnProps = {
  children: ReactNode;
};

export function DispatcherColumn({ children }: DispatcherColumnProps) {
  return (
    <Box
      flex="1"

      maxW="400px"

      h="full"
      alignSelf="stretch"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="gray.200"

      boxShadow="inset 0 3px 14px rgba(0, 0, 0, 0.1), inset 0 1px 4px rgba(0, 0, 0, 0.06)"
      p="3"
      display="flex"
      flexDirection="column"
      minH="0"
      overflowY="auto"      
    >
      <VStack align="stretch" gap={2} flex="1" minH="0">
        {children}
      </VStack>
    </Box>
  );
}
