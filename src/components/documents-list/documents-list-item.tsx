import { useDocumentMeta } from '../../store/documents';
import { Box, SpaceBetween, Stack } from '@nelson-ui/react';
import { Link } from 'wouter';
import { toRelativeTime } from '../../common/time';

export const DocumentListItem = ({ docId }: { docId: string }) => {
  const [data] = useDocumentMeta(docId);
  if (!data) return null;
  return (
    <SpaceBetween borderBottom={'1px solid $border'}>
      <Link href={`/doc/${docId}`}>
        <Box
          width={'100%'}
          lineHeight={'1rem'}
          py={'$extra-loose'}
          color={'$text'}
          textDecoration={'none'}
          _hover={{
            textDecoration: 'underline',
          }}
          as={'a'}
        >
          {data.title ?? 'Untitled document'}
        </Box>
      </Link>

      <Stack flexShrink={0} fontSize={'$1'} color={'$text-subdued'} isInline>
        <Box>Created {toRelativeTime(data?.createdAt / 1000)}</Box>
        <Box>Updated {toRelativeTime(data?.updatedAt / 1000)}</Box>
      </Stack>
    </SpaceBetween>
  );
};
