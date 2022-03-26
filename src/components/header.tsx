import { Box, SpaceBetween } from '@nelson-ui/react';
import { WalletConnectButton } from './wallet-connect-button';
import { Link } from 'wouter';
import { RoutePaths } from './routes';

export const Header = () => {
  return (
    <SpaceBetween py={'$extra-loose'}>
      <Link href={RoutePaths.Home}>
        <Box
          fontFamily={`'Space Grotesk', sans-serif`}
          fontSize={'$4'}
          _hover={{
            cursor: 'pointer',
            opacity: 0.5,
          }}
        >
          nox.sh
        </Box>
      </Link>
      <WalletConnectButton />
    </SpaceBetween>
  );
};
