import { MicroStacksProvider } from '@micro-stacks/react';
import logo from '../../logo.svg';
import React from 'react';

export const MicroStacksWrapper: React.FC = ({ children }) => {
  return (
    <MicroStacksProvider
      authOptions={{
        appDetails: {
          name: 'my cool app',
          icon: logo,
        },
      }}
    >
      {children}
    </MicroStacksProvider>
  );
};
