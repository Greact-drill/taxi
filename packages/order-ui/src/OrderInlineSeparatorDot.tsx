import { Box } from '@chakra-ui/react';

/** Filled circle between name and secondary value. */
export function OrderInlineSeparatorDot() {
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
