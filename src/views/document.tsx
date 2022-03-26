import { Editor } from '../components/editor/editor';
import { Link, useRoute } from 'wouter';
import { RoutePaths } from '../components/global-app/routes';
import { Suspense } from 'react';
import { Box, Stack } from '@nelson-ui/react';
import { TitleEditor } from '../components/editor/document-title-editor';
import { useDocuments } from '../store/documents';

const NotFoundView = () => {
  return (
    <Stack
      pb={'128px'}
      justifyContent={'center'}
      alignItems={'center'}
      flexGrow={1}
      textAlign={'center'}
    >
      <Box fontSize={'$6'}>Can't find this document...</Box>
      <Box lineHeight={'1.65'} maxWidth={'42ch'}>
        Strange, we can't seem to find this document. Why not go home and make a new one?
      </Box>
      <Link href={RoutePaths.Home}>
        <button>Go home!</button>
      </Link>
    </Stack>
  );
};

export const Document = () => {
  const [state] = useDocuments();
  const [, params] = useRoute(RoutePaths.Document);
  if (!params) return null;
  const docId = params.doc_id;
  const docExists = state?.documents[docId];
  if (!docExists) return <NotFoundView />;
  return (
    <Stack
      alignItems={'stretch'}
      justifyContent={'stretch'}
      flexGrow={1}
      mt={'64px'}
      spacing={'$extra-loose'}
    >
      <Suspense fallback={<></>}>
        <TitleEditor docId={params.doc_id} />
      </Suspense>

      <Suspense fallback={<></>}>
        <Editor docId={params.doc_id} />
      </Suspense>
    </Stack>
  );
};
