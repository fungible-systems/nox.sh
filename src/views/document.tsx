import { Editor } from '../components/editor/editor';
import { useRoute } from 'wouter';
import { RoutePaths } from '../components/global-app/routes';
import { Suspense } from 'react';
import { Stack } from '@nelson-ui/react';
import { TitleEditor } from '../components/editor/document-title-editor';

export const Document = () => {
  const [, params] = useRoute(RoutePaths.Document);
  if (!params) return null;
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
