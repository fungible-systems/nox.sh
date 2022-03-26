import { useDocuments } from '../store/documents';
import { Box } from '@nelson-ui/react';

export const MakeNewDocumentAction = ({ label = 'Make your first document' }) => {
  const [, { makeNewDocument, isLoading }] = useDocuments();

  return (
    <Box
      as={'button'}
      opacity={isLoading ? 0.45 : 1}
      cursor={isLoading ? 'not-allowed' : 'default'}
      onClick={async () => {
        if (!isLoading) await makeNewDocument();
      }}
    >
      {label}
    </Box>
  );
};
