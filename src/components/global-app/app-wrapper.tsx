import React from 'react';
import { Box } from '@nelson-ui/react';

export const AppWrapper: React.FC = ({ children }) => (
  <Box
    maxWidth={'1600px'}
    mx={'auto'}
    width={'100%'}
    height={'100vh'}
    display={'flex'}
    flexGrow={1}
    alignItems={'stretch'}
    flexDirection={'column'}
  >
    {children}
  </Box>
);
