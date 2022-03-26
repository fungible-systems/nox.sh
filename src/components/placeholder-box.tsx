import { Box, BoxProps } from '@nelson-ui/react';
import React from 'react';

export function PlaceholderBox(props: BoxProps) {
  return (
    <Box
      borderRadius={'$extra-large'}
      backgroundColor={'$background-subdued'}
      width={'48px'}
      height={'1rem'}
      {...props}
    />
  );
}
