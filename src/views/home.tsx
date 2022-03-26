import { useAuth } from '@micro-stacks/react';
import { Box, Stack } from '@nelson-ui/react';
import { Suspense } from 'react';
import { WalletConnectButton } from '../components/wallet-connect-button';
import { DocumentsList } from '../components/documents-list/documents-list';

const SignedOutView = () => {
  return (
    <Stack
      pb={'128px'}
      justifyContent={'center'}
      alignItems={'center'}
      flexGrow={1}
      textAlign={'center'}
    >
      <Box fontSize={'$6'}>Welcome to Nox!</Box>
      <Box lineHeight={'1.65'} maxWidth={'42ch'}>
        Nox is a decentralized notes app built on Stacks. Please authenticate to get started.
      </Box>
      <WalletConnectButton />
    </Stack>
  );
};

export const Home = () => {
  const { isSignedIn } = useAuth();

  // if we are signed in!
  if (isSignedIn) {
    return (
      <>
        <Suspense fallback={<></>}>
          <DocumentsList />
        </Suspense>
      </>
    );
  }

  // if we are signed out!
  return <SignedOutView />;
};
