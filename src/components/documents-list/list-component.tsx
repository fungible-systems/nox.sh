import { useDocuments } from '../../store/documents';
import { Box, SpaceBetween, Stack } from '@nelson-ui/react';
import { Suspense } from 'react';
import { Link } from 'wouter';
import { PlaceholderBox } from '../placeholder-box';
import { DocumentListItem } from './documents-list-item';

export const ListComponent = () => {
  const [state] = useDocuments();
  if (!state) return null;
  return (
    <Stack spacing={0}>
      {Object.keys(state.documents).map(docId => {
        return (
          <Suspense
            fallback={
              <SpaceBetween borderBottom={'1px solid $border'}>
                <Link href={`/doc/${docId}`}>
                  <Box
                    py={'$extra-loose'}
                    color={'$text'}
                    textDecoration={'none'}
                    _hover={{
                      textDecoration: 'underline',
                    }}
                    as={'a'}
                    position={'relative'}
                    lineHeight={'1rem'}
                  >
                    <PlaceholderBox height={'1rem'} />
                  </Box>
                </Link>
              </SpaceBetween>
            }
          >
            <DocumentListItem key={docId} docId={docId} />
          </Suspense>
        );
      })}
    </Stack>
  );
};
