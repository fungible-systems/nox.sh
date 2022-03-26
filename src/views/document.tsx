import { Editor } from '../components/editor';
import { useRoute } from 'wouter';
import { RoutePaths } from '../components/routes';
import { FormEvent, Suspense } from 'react';
import { useDocumentMeta } from '../store/documents';
import { makeTimestamp } from '../common/utils';
import { Box, Stack } from '@nelson-ui/react';

const TitleEditor = ({ docId }: { docId: string }) => {
  const [state, setState] = useDocumentMeta(docId);

  return (
    <Box
      as={'input'}
      fontFamily={`'Space Grotesk', sans-serif`}
      fontSize={'$7'}
      p={0}
      autoFocus={!state?.title}
      border={0}
      outline={'none'}
      placeholder={'Untitled document'}
      value={state?.title}
      onChange={(e: FormEvent<HTMLInputElement>) => {
        if (!state) return;
        setState({
          ...state,
          updatedAt: makeTimestamp(),
          title: e.currentTarget.value,
        });
      }}
    />
  );
};
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
